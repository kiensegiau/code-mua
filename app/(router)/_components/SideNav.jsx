"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

function SideNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    {
      title: "Trang chủ",
      icon: Home,
      href: "/",
      color: "text-gray-400",
    },
    {
      title: "Khóa học",
      icon: BookOpen,
      href: "/courses",
      color: "text-gray-400",
    },
    {
      title: "Khóa học của tôi",
      icon: GraduationCap,
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
      title: "Yêu thích",
      icon: Star,
      href: "/wishlist",
      color: "text-gray-400",
      requireAuth: true,
    },
    {
      title: "Blog",
      icon: FileText,
      href: "/blog",
      color: "text-gray-400",
    },
    {
      title: "Cộng đồng",
      icon: Users,
      href: "/community",
      color: "text-gray-400",
    },
    {
      title: "Trò chuyện",
      icon: MessageSquare,
      href: "/chat",
      color: "text-gray-400",
      requireAuth: true,
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
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    if (item.requireAuth && !user) return null;

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
      >
        <div
          className={`p-1.5 rounded-md ${
            active ? "bg-[#ff4d4f]/10" : "bg-gray-800"
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

  return (
    <div className="fixed top-[48px] left-0 w-64 h-[calc(100vh-48px)] bg-[#141414] border-r border-gray-800 overflow-y-auto">
      <div className="py-4 flex flex-col gap-2">
        {/* Main Menu */}
        <div className="px-3">
          {menuItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-violet-100 my-2" />

        {/* Support Menu */}
        <div className="px-3">
          {supportItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>

        {/* User Status */}
        {user && (
          <Link
            href="/profile"
            className="block px-4 py-3 mx-3 mt-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition-colors">
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
                <p className="text-sm font-medium text-gray-300 truncate group-hover:text-white transition-colors">
                  {user.email}
                </p>
                <p className="text-xs text-[#ff4d4f]">Xem trang cá nhân</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default SideNav;
