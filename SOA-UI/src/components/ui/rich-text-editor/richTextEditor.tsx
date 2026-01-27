import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Palette,
  Columns,
  Table as TableIcon,
  Plus,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/button/button";
import { cn } from "@/lib/utils";
import uploadService from "@/services/uploadService";
import { ToastHelper } from "@/lib/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import "./richTextEditor.css";

// Custom Image extension with href attribute
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
        parseHTML: (element) => {
          // Check if image is wrapped in a link
          let parent = element.parentElement;
          while (parent && parent.tagName !== "A" && parent.tagName !== "BODY") {
            parent = parent.parentElement;
          }
          if (parent && parent.tagName === "A") {
            return parent.getAttribute("href");
          }
          // Also check data-href attribute
          return element.getAttribute("data-href");
        },
        renderHTML: (attributes) => {
          if (!attributes.href) {
            return {};
          }
          return {
            "data-href": attributes.href,
          };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { href, ...attrs } = HTMLAttributes;
    
    if (href) {
      return [
        "a",
        { href, target: "_blank", rel: "noopener noreferrer" },
        ["img", mergeAttributes(attrs, { class: "max-w-full rounded-md" })],
      ];
    }
    
    return ["img", mergeAttributes(attrs, { class: "max-w-full rounded-md" })];
  },
});

// Type for image attributes with href
type ImageAttributes = {
  src: string;
  alt?: string;
  href?: string | null;
};

// Helper function to set image with proper types using insertContent
function setImageWithHref(
  editor: ReturnType<typeof useEditor> | null,
  attrs: ImageAttributes
) {
  if (!editor) return;
  
  if (attrs.href) {
    // If href exists, wrap image in link
    const altAttr = attrs.alt ? ` alt="${attrs.alt.replace(/"/g, '&quot;')}"` : "";
    editor.chain().focus().insertContent(
      `<a href="${attrs.href}" target="_blank" rel="noopener noreferrer"><img src="${attrs.src}"${altAttr} class="max-w-full rounded-md" /></a>`
    ).run();
  } else {
    // If no href, insert image normally
    const altAttr = attrs.alt ? ` alt="${attrs.alt.replace(/"/g, '&quot;')}"` : "";
    editor.chain().focus().insertContent(
      `<img src="${attrs.src}"${altAttr} class="max-w-full rounded-md" />`
    ).run();
  }
}

interface ImageNode {
  node: {
    type: { name: string };
    attrs: Record<string, unknown> & Partial<ImageAttributes>;
    nodeSize: number;
  };
  pos: number;
}

export type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

// Predefined color palette
const COLOR_PALETTE = [
  "#000000", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#FFFFFF",
  "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899",
  "#F97316", "#EAB308", "#14B8A6", "#6366F1", "#A855F7", "#F43F5E",
];

export default function RichTextEditor({
  value,
  onChange,
  onBlur,
  disabled,
  placeholder = "Nhập nội dung...",
  className,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");
  const [isImageUrlDialogOpen, setIsImageUrlDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageLinkUrl, setImageLinkUrl] = useState("");
  const [isImageLinkDialogOpen, setIsImageLinkDialogOpen] = useState(false);
  const [selectedImageLinkUrl, setSelectedImageLinkUrl] = useState("");

  const editor = useEditor({
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        code: {
          HTMLAttributes: {
            class: "bg-muted px-1 py-0.5 rounded text-sm font-mono",
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      TextStyle,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value ?? "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
  });

  // Keep editor content in sync when form resets/loads existing data.
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value ?? "";
    if (current !== next) editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  const handlePickImage = () => {
    if (!editor || disabled || isUploadingImage) return;
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (file?: File) => {
    if (!file || !editor) return;

    setIsUploadingImage(true);
    const toastId = ToastHelper.loading("Đang upload ảnh...");
    try {
      const url = await uploadService.uploadArticleContentImage(file);
      setImageWithHref(editor, { src: url, alt: file.name, href: null });
      ToastHelper.dismiss(toastId);
      ToastHelper.success("Upload ảnh thành công");
    } catch (err) {
      ToastHelper.dismiss(toastId);
      ToastHelper.error("Upload ảnh thất bại");
      console.error(err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleInsertImageFromUrl = () => {
    if (!editor || !imageUrl) return;

    // Validate URL
    try {
      new URL(imageUrl);
    } catch {
      ToastHelper.error("URL không hợp lệ");
      return;
    }

    // If imageLinkUrl is provided, add href attribute
    const imageAttrs: ImageAttributes = {
      src: imageUrl,
      alt: imageAlt || "Image",
      href: null,
    };
    
    if (imageLinkUrl) {
      try {
        new URL(imageLinkUrl);
        imageAttrs.href = imageLinkUrl;
      } catch {
        ToastHelper.error("URL liên kết không hợp lệ");
        return;
      }
    }
    
    setImageWithHref(editor, imageAttrs);

    setIsImageUrlDialogOpen(false);
    setImageUrl("");
    setImageAlt("");
    setImageLinkUrl("");
    ToastHelper.success("Chèn ảnh thành công");
  };

  const handleAddLinkToImage = () => {
    if (!editor || !selectedImageLinkUrl) return;

    // Validate URL
    try {
      new URL(selectedImageLinkUrl);
    } catch {
      ToastHelper.error("URL không hợp lệ");
      return;
    }

    // Check if image is selected
    const { selection } = editor.state;
    const { $anchor } = selection;
    
    // Find the image node
    let foundImageNode: ImageNode | null = null;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "image" && pos <= $anchor.pos && pos + node.nodeSize >= $anchor.pos) {
        foundImageNode = { 
          node: {
            type: node.type,
            attrs: node.attrs,
            nodeSize: node.nodeSize,
          }, 
          pos 
        };
        return false;
      }
    });

    if (!foundImageNode) {
      ToastHelper.error("Vui lòng chọn một hình ảnh");
      return;
    }

    // Update image with href attribute
    const imagePos = (foundImageNode as ImageNode).pos;
    const imageNodeSize = (foundImageNode as ImageNode).node.nodeSize;
    const imageAttrs = (foundImageNode as ImageNode).node.attrs;
    
    editor.chain().focus().setTextSelection({ from: imagePos, to: imagePos + imageNodeSize }).run();
    editor.chain().focus().updateAttributes("image", { 
      ...imageAttrs,
      href: selectedImageLinkUrl 
    } as Record<string, unknown>).run();
    
    setIsImageLinkDialogOpen(false);
    setSelectedImageLinkUrl("");
    ToastHelper.success("Thêm link cho ảnh thành công");
  };

  const handleOpenImageLinkDialog = () => {
    if (!editor) return;

    // Check if image is selected
    const { selection } = editor.state;
    const { $anchor } = selection;
    
    // Find the image node
    let foundImageNode: ImageNode | null = null;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "image" && pos <= $anchor.pos && pos + node.nodeSize >= $anchor.pos) {
        foundImageNode = { 
          node: {
            type: node.type,
            attrs: node.attrs,
            nodeSize: node.nodeSize,
          }, 
          pos 
        };
        return false;
      }
    });

    if (!foundImageNode) {
      ToastHelper.error("Vui lòng chọn một hình ảnh");
      return;
    }

    // Get href attribute from image
    const imageHref = (foundImageNode as ImageNode).node.attrs.href as string | undefined;
    if (imageHref) {
      setSelectedImageLinkUrl(imageHref);
    } else {
      setSelectedImageLinkUrl("");
    }

    setIsImageLinkDialogOpen(true);
  };

  const handleInsertLink = () => {
    if (!editor || !linkUrl) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    
    // Check if we're in a link
    if (editor.isActive("link")) {
      // Update existing link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else if (selectedText) {
      // Wrap selected text with link
      editor
        .chain()
        .focus()
        .setLink({ href: linkUrl })
        .run();
    } else {
      // Insert link at cursor
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}">${linkText || linkUrl}</a>`)
        .run();
    }
    
    setIsLinkDialogOpen(false);
    setLinkUrl("");
    setLinkText("");
  };

  const handleSetColor = (color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setIsColorPickerOpen(false);
  };

  const handleTwoColumn = () => {
    if (!editor) return;
    const twoColumnHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 0.75rem 0;">
        <div>
          <p>Nội dung cột 1</p>
        </div>
        <div>
          <p>Nội dung cột 2</p>
        </div>
      </div>
    `;
    editor.chain().focus().insertContent(twoColumnHTML).run();
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled: btnDisabled = false,
    icon: Icon,
    label,
    tooltip,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    icon: React.ComponentType<{ className?: string }>;
    label?: string;
    tooltip?: string;
  }) => (
    <div title={tooltip}>
      <Button
        type="button"
        variant={isActive ? "default" : "outline"}
        size="sm"
        disabled={!editor || !!disabled || btnDisabled}
        onClick={onClick}
        className="h-8 w-8 p-0"
      >
        <Icon className="h-4 w-4" />
        {label && <span className="ml-1">{label}</span>}
      </Button>
    </div>
  );

  return (
    <div className={cn("w-full border rounded-md overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b bg-muted/30 p-2">
        {/* Headings */}
        <div className="flex gap-1 border-r pr-2 mr-1">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor?.isActive("heading", { level: 1 })}
            icon={Heading1}
            tooltip="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor?.isActive("heading", { level: 2 })}
            icon={Heading2}
            tooltip="Heading 2"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor?.isActive("heading", { level: 3 })}
            icon={Heading3}
            tooltip="Heading 3"
          />
        </div>

        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2 mr-1">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            isActive={editor?.isActive("bold")}
            icon={Bold}
            tooltip="Bold"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            isActive={editor?.isActive("italic")}
            icon={Italic}
            tooltip="Italic"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            isActive={editor?.isActive("underline")}
            icon={UnderlineIcon}
            tooltip="Underline"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCode().run()}
            isActive={editor?.isActive("code")}
            icon={Code}
            tooltip="Code"
          />
        </div>

        {/* Text Align */}
        <div className="flex gap-1 border-r pr-2 mr-1">
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            isActive={editor?.isActive({ textAlign: "left" })}
            icon={AlignLeft}
            tooltip="Align Left"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            isActive={editor?.isActive({ textAlign: "center" })}
            icon={AlignCenter}
            tooltip="Align Center"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            isActive={editor?.isActive({ textAlign: "right" })}
            icon={AlignRight}
            tooltip="Align Right"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
            isActive={editor?.isActive({ textAlign: "justify" })}
            icon={AlignJustify}
            tooltip="Justify"
          />
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r pr-2 mr-1">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            isActive={editor?.isActive("bulletList")}
            icon={List}
            tooltip="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            isActive={editor?.isActive("orderedList")}
            icon={ListOrdered}
            tooltip="Numbered List"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            isActive={editor?.isActive("blockquote")}
            icon={Quote}
            tooltip="Quote"
          />
        </div>

        {/* Color Picker */}
        <div className="flex gap-1 border-r pr-2 mr-1 relative">
          <Dialog open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
            <DialogTrigger asChild>
              <div title="Text Color">
                <Button
                  type="button"
                  variant={editor?.isActive("textStyle") ? "default" : "outline"}
                  size="sm"
                  disabled={!editor || !!disabled}
                  className="h-8 w-8 p-0"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Chọn màu chữ</DialogTitle>
                <DialogDescription>
                  Chọn màu từ bảng màu hoặc nhập mã màu tùy chỉnh
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-6 gap-2">
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        "h-10 w-10 rounded border-2 transition-all hover:scale-110",
                        color === "#FFFFFF" && "border-gray-300"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => handleSetColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="custom-color">Màu tùy chỉnh:</Label>
                  <Input
                    id="custom-color"
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => handleSetColor(customColor)}
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Link */}
        <div className="flex gap-1 border-r pr-2 mr-1">
          <Dialog 
            open={isLinkDialogOpen} 
            onOpenChange={(open) => {
              setIsLinkDialogOpen(open);
              if (open && editor) {
                // Pre-fill link URL if editing existing link
                if (editor.isActive("link")) {
                  const attrs = editor.getAttributes("link");
                  setLinkUrl(attrs.href || "");
                  const { from, to } = editor.state.selection;
                  setLinkText(editor.state.doc.textBetween(from, to, " "));
                } else {
                  const { from, to } = editor.state.selection;
                  const selectedText = editor.state.doc.textBetween(from, to, " ");
                  setLinkText(selectedText);
                }
              } else {
                setLinkUrl("");
                setLinkText("");
              }
            }}
          >
            <DialogTrigger asChild>
              <div title="Insert Link">
                <Button
                  type="button"
                  variant={editor?.isActive("link") ? "default" : "outline"}
                  size="sm"
                  disabled={!editor || !!disabled}
                  className="h-8 w-8 p-0"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Chèn liên kết</DialogTitle>
                <DialogDescription>
                  Nhập URL và văn bản hiển thị cho liên kết
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    type="url"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-text">Văn bản hiển thị (tùy chọn)</Label>
                  <Input
                    id="link-text"
                    type="text"
                    placeholder="Văn bản liên kết"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsLinkDialogOpen(false);
                    setLinkUrl("");
                    setLinkText("");
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleInsertLink}
                  disabled={!linkUrl}
                >
                  Chèn
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Image */}
        <div className="flex gap-1 border-r pr-2 mr-1">
          <Dialog open={isImageLinkDialogOpen} onOpenChange={setIsImageLinkDialogOpen}>
            <DialogTrigger asChild>
              <div title="Thêm link cho ảnh">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!editor || !!disabled}
                  className="h-8 w-8 p-0"
                  onClick={handleOpenImageLinkDialog}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm link cho hình ảnh</DialogTitle>
                <DialogDescription>
                  Nhập URL để khi click vào ảnh sẽ chuyển đến link này
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="image-link-url">URL liên kết</Label>
                  <Input
                    id="image-link-url"
                    type="url"
                    placeholder="https://example.com"
                    value={selectedImageLinkUrl}
                    onChange={(e) => setSelectedImageLinkUrl(e.target.value)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Lưu ý: Vui lòng chọn một hình ảnh trong editor trước khi thêm link
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsImageLinkDialogOpen(false);
                    setSelectedImageLinkUrl("");
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleAddLinkToImage}
                  disabled={!selectedImageLinkUrl}
                >
                  Thêm link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isImageUrlDialogOpen} onOpenChange={setIsImageUrlDialogOpen}>
            <DialogTrigger asChild>
              <div title="Chèn ảnh">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!editor || !!disabled || isUploadingImage}
                  className="h-8 w-8 p-0"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Chèn hình ảnh</DialogTitle>
                <DialogDescription>
                  Chèn ảnh từ URL hoặc upload từ máy tính
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">URL hình ảnh</Label>
                  <Input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-alt">Mô tả ảnh (tùy chọn)</Label>
                  <Input
                    id="image-alt"
                    type="text"
                    placeholder="Mô tả hình ảnh"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-link-url">Link khi click vào ảnh (tùy chọn)</Label>
                  <Input
                    id="image-link-url"
                    type="url"
                    placeholder="https://example.com"
                    value={imageLinkUrl}
                    onChange={(e) => setImageLinkUrl(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsImageUrlDialogOpen(false);
                    handlePickImage();
                  }}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? "Đang upload..." : "Upload từ máy tính"}
                </Button>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsImageUrlDialogOpen(false);
                    setImageUrl("");
                    setImageAlt("");
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleInsertImageFromUrl}
                  disabled={!imageUrl}
                >
                  Chèn từ URL
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-1 border-r pr-2 mr-1">
          <ToolbarButton
            onClick={handleTwoColumn}
            icon={Columns}
            tooltip="Two Column Layout"
          />
        </div>

        {/* Table */}
        <div className="flex gap-1 border-r pr-2 mr-1">
          <ToolbarButton
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            icon={TableIcon}
            tooltip="Insert Table"
          />
          {editor?.isActive("table") && (
            <>
              <ToolbarButton
                onClick={() => editor?.chain().focus().addRowAfter().run()}
                icon={Plus}
                tooltip="Add Row"
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().addColumnAfter().run()}
                icon={Plus}
                tooltip="Add Column"
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().deleteTable().run()}
                icon={Trash2}
                tooltip="Delete Table"
              />
            </>
          )}
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor?.chain().focus().undo().run()}
            icon={Undo}
            tooltip="Undo"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().redo().run()}
            icon={Redo}
            tooltip="Redo"
          />
        </div>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          // Allow selecting the same file again
          e.target.value = "";
          await handleImageSelected(file);
        }}
      />

      {/* Editor Content */}
      <div className="min-h-[240px] p-3 bg-background">
        <EditorContent
          editor={editor}
          className="tiptap-editor focus:outline-none"
        />
      </div>
    </div>
  );
}
