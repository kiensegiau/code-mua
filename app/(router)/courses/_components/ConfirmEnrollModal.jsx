"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

function ConfirmEnrollModal({
  isOpen,
  onClose,
  onConfirm,
  course,
  userBalance,
  loading,
}) {
  const formatPrice = (price) => {
    if (!price && price !== 0) return "0";
    return price.toLocaleString("vi-VN");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1f1f1f] rounded-lg shadow-xl z-50 border border-gray-800">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-semibold text-gray-200">
                Xác nhận đăng ký khóa học
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-200 mb-2">
                  {course?.title || ""}
                </h3>
                <p className="text-sm text-gray-400">{course?.subname || ""}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Giá khóa học</p>
                  <p className="text-lg font-semibold text-[#ff4d4f]">
                    {formatPrice(course?.price)} VND
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Số dư hiện tại</p>
                  <p className="text-lg font-semibold text-gray-200">
                    {formatPrice(userBalance)} VND
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Số dư sau khi mua</p>
                <p className="text-lg font-semibold text-gray-200">
                  {formatPrice((userBalance || 0) - (course?.price || 0))} VND
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-[#ff4d4f] text-white hover:bg-[#ff4d4f]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    "Xác nhận đăng ký"
                  )}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ConfirmEnrollModal;
