"use client";

export default function Home() {
  return (
    <div className="noise-overlay" style={{ background: "#0e0b08", minHeight: "100vh", color: "#fef3c7" }}>
      {/* Navigation */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "1.25rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(14, 11, 8, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(217, 119, 6, 0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #d97706, #92400e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}>☕</div>
          <span style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #fbbf24, #d97706)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>BrewOrder</span>
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {["Features", "How It Works", "Tech Stack", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} style={{
              color: "#9ca3af",
              fontSize: "0.875rem",
              textDecoration: "none",
              fontWeight: 500,
              letterSpacing: "0.02em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#fbbf24"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#9ca3af"; }}
            >{item}</a>
          ))}
        </div>
        <a href="#contact" className="btn-primary" style={{
          padding: "0.5rem 1.25rem",
          borderRadius: "8px",
          fontSize: "0.875rem",
          textDecoration: "none",
          display: "inline-block",
          position: "relative",
          zIndex: 1,
        }}>
          Get Started
        </a>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "5rem",
      }}>
        {/* Background gradient orbs */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(146, 64, 14, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }} />

        {/* Grid lines decoration */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(217, 119, 6, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217, 119, 6, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 2rem",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}>
          <div className="animate-fadeInUp opacity-0-start" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(217, 119, 6, 0.1)",
            border: "1px solid rgba(217, 119, 6, 0.3)",
            borderRadius: "100px",
            padding: "0.35rem 1rem",
            fontSize: "0.8rem",
            color: "#fbbf24",
            letterSpacing: "0.08em",
            fontWeight: 600,
            marginBottom: "2rem",
            textTransform: "uppercase",
          }}>
            <span>✦</span>
            <span>POS System for Beverage Shops</span>
            <span>✦</span>
          </div>

          <h1 className="animate-fadeInUp delay-200 opacity-0-start" style={{
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "1.5rem",
          }}>
            <span style={{ color: "#fef3c7" }}>Your Shop,</span>
            <br />
            <span className="shimmer-text">Perfectly Ordered</span>
          </h1>

          <p className="animate-fadeInUp delay-400 opacity-0-start" style={{
            fontSize: "1.2rem",
            color: "#9ca3af",
            lineHeight: 1.7,
            maxWidth: "580px",
            margin: "0 auto 3rem",
            fontWeight: 400,
          }}>
            A complete POS solution for beverage shops. Manage orders in real-time,
            track your menu, and grow your revenue — all from one elegant platform.
          </p>

          <div className="animate-fadeInUp delay-600 opacity-0-start" style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            <a href="#features" className="btn-primary" style={{
              padding: "0.9rem 2rem",
              borderRadius: "10px",
              fontSize: "1rem",
              textDecoration: "none",
              display: "inline-block",
              position: "relative",
              zIndex: 1,
              fontWeight: 700,
            }}>
              Explore Features →
            </a>
            <a href="#how-it-works" className="btn-secondary" style={{
              padding: "0.9rem 2rem",
              borderRadius: "10px",
              fontSize: "1rem",
              textDecoration: "none",
              display: "inline-block",
            }}>
              See How It Works
            </a>
          </div>

          {/* Stats row */}
          <div className="animate-fadeInUp delay-700 opacity-0-start" style={{
            display: "flex",
            gap: "3rem",
            justifyContent: "center",
            marginTop: "5rem",
            flexWrap: "wrap",
          }}>
            {[
              { value: "Real-time", label: "Order sync" },
              { value: "Multi-size", label: "Product variants" },
              { value: "Topping", label: "Customization" },
              { value: "Dashboard", label: "Analytics" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "#fbbf24",
                  letterSpacing: "-0.02em",
                }}>{stat.value}</div>
                <div style={{
                  fontSize: "0.8rem",
                  color: "#6b7280",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginTop: "0.25rem",
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating beverage icon */}
        <div className="animate-float" style={{
          position: "absolute",
          top: "15%",
          right: "8%",
          fontSize: "5rem",
          opacity: 0.15,
          filter: "blur(2px)",
        }}>🧋</div>
        <div className="animate-float delay-300" style={{
          position: "absolute",
          bottom: "20%",
          left: "6%",
          fontSize: "3.5rem",
          opacity: 0.1,
          filter: "blur(2px)",
        }}>☕</div>
      </section>

      <div className="section-divider" />

      {/* Features Section */}
      <section id="features" style={{ padding: "8rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <div style={{
              fontSize: "0.75rem",
              color: "#d97706",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "1rem",
            }}>Core Features</div>
            <h2 style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#fef3c7",
              marginBottom: "1rem",
            }}>
              Everything you need to<br />
              <span className="gradient-text">run a modern shop</span>
            </h2>
            <p style={{ color: "#6b7280", fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto" }}>
              Built for speed, designed for simplicity. Every feature crafted to keep your shop flowing.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {[
              {
                icon: "📋",
                title: "Smart Order Management",
                desc: "Create, track, and manage orders with lightning speed. Real-time status updates keep your team in sync.",
                tag: "Core",
              },
              {
                icon: "🧋",
                title: "Product & Menu Builder",
                desc: "Organize categories, products with multiple sizes and toppings. Manage your entire menu with ease.",
                tag: "Menu",
              },
              {
                icon: "🎟",
                title: "Voucher & Promotions",
                desc: "Create discount codes with flexible rules — percentage or fixed, with usage limits and date ranges.",
                tag: "Marketing",
              },
              {
                icon: "📊",
                title: "Revenue Dashboard",
                desc: "Track daily revenue, top-selling products, and order trends with beautiful real-time analytics.",
                tag: "Analytics",
              },
              {
                icon: "📱",
                title: "Mobile Staff App",
                desc: "Staff take orders on mobile, apply vouchers, and print receipts. Seamlessly synced to the admin.",
                tag: "Mobile",
              },
              {
                icon: "⚡",
                title: "Real-time Queue",
                desc: "Live order queue with Kanban board. New orders appear instantly — no refresh needed.",
                tag: "Real-time",
              },
            ].map((feature) => (
              <div key={feature.title} className="card-glass" style={{
                borderRadius: "16px",
                padding: "2rem",
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  background: "rgba(217, 119, 6, 0.15)",
                  fontSize: "1.6rem",
                  marginBottom: "1.25rem",
                }}>{feature.icon}</div>
                <div style={{
                  display: "inline-block",
                  fontSize: "0.7rem",
                  color: "#d97706",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  background: "rgba(217, 119, 6, 0.1)",
                  borderRadius: "4px",
                  padding: "0.2rem 0.6rem",
                  marginBottom: "0.75rem",
                  marginLeft: "0.5rem",
                }}>{feature.tag}</div>
                <h3 style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#fef3c7",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.01em",
                }}>{feature.title}</h3>
                <p style={{
                  fontSize: "0.9rem",
                  color: "#6b7280",
                  lineHeight: 1.65,
                }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: "8rem 2rem", position: "relative" }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217, 119, 6, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <div style={{
              fontSize: "0.75rem",
              color: "#d97706",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "1rem",
            }}>Workflow</div>
            <h2 style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#fef3c7",
            }}>
              From order to<br />
              <span className="gradient-text">delivery in seconds</span>
            </h2>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}>
            {[
              {
                step: "01",
                title: "Staff Takes the Order",
                desc: "Mobile staff app loads the full menu with categories, products, sizes and toppings. Staff customizes the order and applies voucher codes.",
                side: "left",
              },
              {
                step: "02",
                title: "Order Syncs to Admin",
                desc: "Order is instantly broadcast via Socket.IO to the admin dashboard. The order queue updates in real-time — no polling, no delay.",
                side: "right",
              },
              {
                step: "03",
                title: "Kitchen Prepares & Updates Status",
                desc: "Admin marks orders from Pending → Confirmed → Preparing → Ready. Staff and customers see live status changes.",
                side: "left",
              },
              {
                step: "04",
                title: "Payment & Receipt Printed",
                desc: "Staff processes payment (Cash, Card, Bank Transfer). Receipt is printed via Bluetooth printer with all order details and VAT.",
                side: "right",
              },
            ].map((item, i) => (
              <div key={item.step} style={{
                display: "flex",
                gap: "2rem",
                alignItems: "center",
                flexDirection: item.side === "right" ? "row-reverse" : "row",
              }}>
                <div style={{
                  flexShrink: 0,
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(217, 119, 6, 0.1)",
                  border: "2px solid rgba(217, 119, 6, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  color: "#d97706",
                  letterSpacing: "-0.02em",
                  fontFamily: "monospace",
                }}>{item.step}</div>
                <div className="card-glass" style={{
                  flex: 1,
                  borderRadius: "14px",
                  padding: "1.75rem 2rem",
                }}>
                  <h3 style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#fef3c7",
                    marginBottom: "0.5rem",
                  }}>{item.title}</h3>
                  <p style={{
                    fontSize: "0.9rem",
                    color: "#6b7280",
                    lineHeight: 1.65,
                  }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Tech Stack Section */}
      <section id="tech-stack" style={{ padding: "8rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <div style={{
              fontSize: "0.75rem",
              color: "#d97706",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "1rem",
            }}>Under The Hood</div>
            <h2 style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#fef3c7",
            }}>
              Built with the<br />
              <span className="gradient-text">best tools available</span>
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.25rem",
          }}>
            {[
              { category: "Backend", icon: "⚙️", items: [".NET 8", "Entity Framework Core", "PostgreSQL", "Clean Architecture"] },
              { category: "Admin Panel", icon: "🖥", items: ["React 18", "TailwindCSS", "Shadcn UI", "React Router"] },
              { category: "Mobile App", icon: "📱", items: ["React Native", "Expo", "Socket.IO Client", "Secure Storage"] },
              { category: "Infrastructure", icon: "🔧", items: ["Socket.IO / SignalR", "JWT Auth", "REST API", "Docker Ready"] },
            ].map((stack) => (
              <div key={stack.category} className="card-glass" style={{
                borderRadius: "16px",
                padding: "2rem",
              }}>
                <div style={{
                  fontSize: "2rem",
                  marginBottom: "0.75rem",
                }}>{stack.icon}</div>
                <h3 style={{
                  fontSize: "0.75rem",
                  color: "#d97706",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: "1.25rem",
                }}>{stack.category}</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {stack.items.map((item) => (
                    <li key={item} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid rgba(217, 119, 6, 0.08)",
                      fontSize: "0.9rem",
                      color: "#d1d5db",
                    }}>
                      <span style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#d97706",
                        flexShrink: 0,
                      }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Screenshot / Preview Section */}
      <section style={{ padding: "8rem 2rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            fontSize: "0.75rem",
            color: "#d97706",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: "1rem",
          }}>Interface Preview</div>
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#fef3c7",
            marginBottom: "4rem",
          }}>
            Clean. Fast.<br />
            <span className="gradient-text">Intuitive by design</span>
          </h2>

          {/* Mock Dashboard Card */}
          <div style={{
            background: "rgba(26, 20, 16, 0.9)",
            border: "1px solid rgba(217, 119, 6, 0.2)",
            borderRadius: "20px",
            padding: "2rem",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Window controls */}
            <div style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.5rem",
            }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map((color) => (
                <div key={color} style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: color,
                  opacity: 0.8,
                }} />
              ))}
            </div>

            {/* Mock dashboard layout */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              gap: "1.5rem",
              textAlign: "left",
            }}>
              {/* Sidebar mock */}
              <div style={{
                background: "rgba(217, 119, 6, 0.05)",
                borderRadius: "12px",
                padding: "1.25rem",
                border: "1px solid rgba(217, 119, 6, 0.1)",
              }}>
                <div style={{
                  fontSize: "0.75rem",
                  color: "#fbbf24",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  letterSpacing: "0.05em",
                }}>BREWORDER</div>
                {["Dashboard", "Orders", "Products", "Categories", "Toppings", "Vouchers", "Settings"].map((item, i) => (
                  <div key={item} style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "6px",
                    background: i === 1 ? "rgba(217, 119, 6, 0.15)" : "transparent",
                    color: i === 1 ? "#fbbf24" : "#6b7280",
                    fontSize: "0.8rem",
                    marginBottom: "0.25rem",
                    borderLeft: i === 1 ? "2px solid #d97706" : "2px solid transparent",
                  }}>{item}</div>
                ))}
              </div>

              {/* Main content mock */}
              <div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}>
                  {[
                    { label: "Today Revenue", value: "₫2,450,000", up: true },
                    { label: "Orders Today", value: "47", up: true },
                    { label: "Pending Queue", value: "8", up: false },
                  ].map((stat) => (
                    <div key={stat.label} style={{
                      background: "rgba(217, 119, 6, 0.07)",
                      border: "1px solid rgba(217, 119, 6, 0.12)",
                      borderRadius: "10px",
                      padding: "1rem",
                    }}>
                      <div style={{ fontSize: "0.7rem", color: "#6b7280", marginBottom: "0.4rem" }}>{stat.label}</div>
                      <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fef3c7" }}>{stat.value}</div>
                      <div style={{ fontSize: "0.7rem", color: stat.up ? "#22c55e" : "#f59e0b", marginTop: "0.3rem" }}>
                        {stat.up ? "↑ +12% vs yesterday" : "⏳ Processing"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order list mock */}
                <div style={{
                  background: "rgba(217, 119, 6, 0.04)",
                  border: "1px solid rgba(217, 119, 6, 0.1)",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid rgba(217, 119, 6, 0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fef3c7" }}>Recent Orders</span>
                    <span style={{ fontSize: "0.7rem", color: "#d97706" }}>View all →</span>
                  </div>
                  {[
                    { id: "ORD-001", item: "Trà Sữa Taro L + Thạch", status: "Preparing", amount: "55,000đ", color: "#f59e0b" },
                    { id: "ORD-002", item: "Cà Phê Sữa Đá M × 2", status: "Ready", amount: "60,000đ", color: "#22c55e" },
                    { id: "ORD-003", item: "Hồng Trà Lài S", status: "Pending", amount: "35,000đ", color: "#6b7280" },
                  ].map((order) => (
                    <div key={order.id} style={{
                      padding: "0.65rem 1rem",
                      borderBottom: "1px solid rgba(217, 119, 6, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}>
                      <span style={{ fontSize: "0.7rem", color: "#d97706", fontFamily: "monospace", fontWeight: 600, flexShrink: 0 }}>{order.id}</span>
                      <span style={{ fontSize: "0.75rem", color: "#9ca3af", flex: 1 }}>{order.item}</span>
                      <span style={{
                        fontSize: "0.65rem",
                        color: order.color,
                        background: `${order.color}18`,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}>{order.status}</span>
                      <span style={{ fontSize: "0.75rem", color: "#fbbf24", fontWeight: 700, flexShrink: 0 }}>{order.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA Section */}
      <section id="contact" style={{ padding: "8rem 2rem", textAlign: "center", position: "relative" }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #d97706, #92400e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 2rem",
          }}>☕</div>
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#fef3c7",
            marginBottom: "1.25rem",
          }}>
            Ready to brew<br />
            <span className="gradient-text">something great?</span>
          </h2>
          <p style={{
            fontSize: "1.05rem",
            color: "#6b7280",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}>
            Start managing your beverage shop with a system built for speed and simplicity.
            Designed for the Vietnamese market, ready for growth.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://github.com/congthien2003/cms-order" className="btn-primary" style={{
              padding: "0.9rem 2rem",
              borderRadius: "10px",
              fontSize: "1rem",
              textDecoration: "none",
              display: "inline-block",
              position: "relative",
              zIndex: 1,
              fontWeight: 700,
            }}>
              View on GitHub
            </a>
            <a href="#features" className="btn-secondary" style={{
              padding: "0.9rem 2rem",
              borderRadius: "10px",
              fontSize: "1rem",
              textDecoration: "none",
              display: "inline-block",
            }}>
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(217, 119, 6, 0.1)",
        padding: "2.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #d97706, #92400e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}>☕</div>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fbbf24" }}>BrewOrder</span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "#4b5563" }}>
          © 2026 BrewOrder · CMS Order Management System · Built with ❤️ for beverage shops
        </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["GitHub", "Docs", "API"].map((link) => (
            <a key={link} href="#" style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#fbbf24"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#6b7280"; }}
            >{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
