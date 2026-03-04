import { useState, useCallback, useEffect, useRef } from 'react';
import { orderService } from '@/services';
import type { Order, OrderStatus } from '@/models/pos';
import { ensureOrderHubConnected } from '@/lib/realtime/orderHubConnection';
import { HubConnectionState } from '@microsoft/signalr';
import type {
  ApiResponse,
  PagedList,
  PaginationParams,
} from '@/models/common/api';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export type TabType = 'queue' | 'today' | 'all';

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<PagedList<Order> | null>(null);
  const [todayOrders, setTodayOrders] = useState<Order[]>([]);
  const [queueOrders, setQueueOrders] = useState<Order[]>([]);
  const isHubInitialized = useRef(false);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('queue');

  // Fetch all orders with pagination
  const fetchOrders = useCallback(
    async (params?: {
      page?: number;
      pageSize?: number;
      searchTerm?: string;
      status?: OrderStatus;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderService.getList({
          pageNumber: params?.page ?? pagination.page,
          pageSize: params?.pageSize ?? pagination.pageSize,
          search: params?.searchTerm ?? (searchTerm || undefined),
          status:
            params?.status ?? ((statusFilter as OrderStatus) || undefined),
        });
        if (response?.success && response.data) {
          setOrders(response.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch orders';
        setError(errorMessage);
        showErrorToast('Không thể tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize, searchTerm, statusFilter]
  );

  // Fetch today's orders
  const fetchTodayOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getToday();
      if (response?.success && response.data) {
        setTodayOrders(response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch today orders';
      setError(errorMessage);
      showErrorToast('Không thể tải đơn hàng hôm nay');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch queue orders
  const fetchQueueOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getQueue();
      if (response?.success && response.data) {
        setQueueOrders(response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch queue orders';
      setError(errorMessage);
      showErrorToast('Không thể tải hàng đợi đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch based on active tab
  const fetchByTab = useCallback(
    (tab: TabType) => {
      switch (tab) {
        case 'queue':
          fetchQueueOrders();
          break;
        case 'today':
          fetchTodayOrders();
          break;
        case 'all':
          fetchOrders();
          break;
      }
    },
    [fetchOrders, fetchTodayOrders, fetchQueueOrders]
  );

  // Initial fetch + SignalR realtime for queue
  useEffect(() => {
    fetchByTab(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isHubInitialized.current) return;
    isHubInitialized.current = true;

    let isCancelled = false;

    const init = async () => {
      try {
        const conn = await ensureOrderHubConnected();

        if (isCancelled) return;

        conn.on('NewOrder', (newOrder: Order) => {
          setQueueOrders((prev) => {
            const exists = prev.some((o) => o.id === newOrder.id);
            if (exists) return prev;

            const merged = [...prev, newOrder].sort((a, b) => {
              const aTime = new Date(a.createdAt || a.createdDate).getTime();
              const bTime = new Date(b.createdAt || b.createdDate).getTime();
              return aTime - bTime;
            });

            return merged;
          });
        });

        conn.onreconnected(() => {
          // Ensure group membership after reconnect
          conn.invoke('JoinAdminsGroup').catch(() => undefined);
        });
      } catch {
        // ignore
      }
    };

    init();

    return () => {
      isCancelled = true;
      const cleanup = async () => {
        try {
          const conn = await ensureOrderHubConnected();
          if (conn.state === HubConnectionState.Connected) {
            conn.off('NewOrder');
          }
        } catch {
          // ignore
        }
      };
      cleanup();
    };
  }, []);

  // Handle tab change
  const handleTabChange = useCallback(
    (tab: TabType) => {
      setActiveTab(tab);
      fetchByTab(tab);
    },
    [fetchByTab]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchOrders({
        page,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined,
        status: (statusFilter as OrderStatus) || undefined,
      });
    },
    [pagination.pageSize, searchTerm, statusFilter, fetchOrders]
  );

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchOrders({
        page: 1,
        pageSize: pagination.pageSize,
        searchTerm: term || undefined,
        status: (statusFilter as OrderStatus) || undefined,
      });
    },
    [pagination.pageSize, statusFilter, fetchOrders]
  );

  const handleStatusFilter = useCallback(
    (value: string) => {
      const filterStatus = value === 'all' ? '' : value;
      setStatusFilter(filterStatus);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchOrders({
        page: 1,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined,
        status: (filterStatus as OrderStatus) || undefined,
      });
    },
    [pagination.pageSize, searchTerm, fetchOrders]
  );

  const updateOrderStatus = useCallback(
    async (
      orderId: string,
      newStatus: OrderStatus
    ): Promise<ApiResponse<Order> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderService.updateStatus(orderId, {
          status: newStatus,
        });
        if (response?.success) {
          showSuccessToast('Cập nhật trạng thái thành công');
          // Refresh based on active tab
          fetchByTab(activeTab);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update order status';
        setError(errorMessage);
        showErrorToast('Không thể cập nhật trạng thái');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [activeTab, fetchByTab]
  );

  const getOrderById = useCallback(
    async (id: string): Promise<ApiResponse<Order> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderService.getById(id);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch order';
        setError(errorMessage);
        showErrorToast('Không thể tải thông tin đơn hàng');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    // State
    loading,
    error,
    orders,
    todayOrders,
    queueOrders,
    pagination,
    searchTerm,
    statusFilter,
    activeTab,

    // Actions
    fetchOrders,
    fetchTodayOrders,
    fetchQueueOrders,
    handleTabChange,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    updateOrderStatus,
    getOrderById,
  };
};

export default useOrder;
