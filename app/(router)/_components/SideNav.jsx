"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  GraduationCap,
  BookMarked,
  Users,
  FileText,
  MessageSquare,
  HelpCircle,
  Settings,
  Star,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/app/_context/AuthContext";
import { useMobileMenu } from "@/app/_context/MobileMenuContext";

function SideNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { closeMobileMenu } = useMobileMenu();
  const router = useRouter();

  const menuItems = [
    {
      title: "Trang chủ",
      icon: Home,
      href: "/home",
      color: "text-gray-400",
    },
    {
      title: "Tất cả khóa học",
      icon: BookOpen,
      href: "/courses",
      color: "text-gray-400",
    },
    {
      title: "Lớp 12",
      icon: GraduationCap,
      href: "/courses/grade-12",
      color: "text-gray-400",
    },
    {
      title: "Lớp 11",
      icon: GraduationCap,
      href: "/courses/grade-11",
      color: "text-gray-400",
    },
    {
      title: "Lớp 10",
      icon: GraduationCap,
      href: "/courses/grade-10",
      color: "text-gray-400",
    },
    {
      title: "Khóa học của tôi",
      icon: BookMarked,
      href: "/my-courses",
      color: "text-gray-400",
      requireAuth: true,
    },
    {
      title: "Kiếm tiền",
      icon: DollarSign,
      href: "/earnings",
      color: "text-gray-400",
      requireAuth: true,
      badge: "Mới",
    },
    {
      title: "Cộng đồng",
      icon: Users,
      href: "/community",
      color: "text-gray-400",
    },
  ];

  const supportItems = [
    {
      title: "Trợ giúp & Hỗ trợ",
      icon: HelpCircle,
      href: "/help",
      color: "text-gray-400",
    },
    {
      title: "Cài đặt",
      icon: Settings,
      href: "/settings",
      color: "text-gray-400",
    },
  ];

  const isActive = (href) => {
    if (href === "/home" && pathname === "/") {
      return true;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    if (item.requireAuth && !user) return null;

    const handleItemClick = () => {
      if (window.innerWidth < 768) {
        closeMobileMenu();
      }
    };

    return (
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all
          ${
            active
              ? "bg-[#ff4d4f]/10 text-[#ff4d4f] font-medium"
              : "text-gray-400 hover:bg-[#ff4d4f]/5 hover:text-[#ff4d4f]"
          }
        `}
        onClick={handleItemClick}
      >
        <div
          className={`p-1.5 rounded-md ${
            active ? "bg-[#ff4d4f]/10" : "bg-[var(--card-background)]"
          }`}
        >
          <Icon
            className={`h-[18px] w-[18px] ${
              active ? "text-[#ff4d4f]" : item.color
            }`}
          />
        </div>
        <span className="text-sm">{item.title}</span>
        {item.badge && (
          <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-[#ff4d4f]/10 text-[#ff4d4f]">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const handleUserProfileClick = () => {
    router.push("/settings");
    if (window.innerWidth < 768) {
      closeMobileMenu();
    }
  };

  return (
    <div className="fixed top-[48px] left-0 w-64 h-[calc(100vh-48px)] bg-[var(--sidebar-background)] border-r border-[var(--border-color)] overflow-y-auto z-40 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <div className="py-4 flex flex-col gap-2">
        {/* Main Menu */}
        <div className="px-3">
          {menuItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border-color)] my-2" />

        {/* Support Menu */}
        <div className="px-3">
          {supportItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>

        {/* User Status */}
        {user && (
          <Link
            href="/settings"
            className="block px-4 py-3 mx-3 mt-2 bg-[var(--card-background)]/50 hover:bg-[var(--hover-color)] rounded-lg transition-colors group"
            onClick={handleUserProfileClick}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--card-background)] group-hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.email}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <Users className="h-4 w-4 text-[#ff4d4f]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-color)] truncate group-hover:text-[var(--text-color)] transition-colors">
                  {user.email}
                </p>
                <p className="text-xs text-[#ff4d4f]">Quản lý tài khoản</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Hiển thị bottom navigation trên thiết bị di động */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--sidebar-background)] border-t border-[var(--border-color)] flex justify-around items-center p-2 z-50">
        {menuItems.slice(0, 4).map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.requireAuth && !user) return null;

          return (
            <Link
              key={index}
              href={item.href}
              className="p-2 flex flex-col items-center"
              onClick={() => {
                if (window.innerWidth < 768) {
                  closeMobileMenu();
                }
              }}
            >
              <div
                className={`p-1.5 rounded-md ${
                  active ? "bg-[#ff4d4f]/10" : "bg-transparent"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active ? "text-[#ff4d4f]" : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-1 ${
                  active ? "text-[#ff4d4f]" : "text-gray-400"
                }`}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SideNav;
