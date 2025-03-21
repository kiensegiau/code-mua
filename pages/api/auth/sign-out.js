/**
 * API endpoint để xử lý đăng xuất và xóa cookie
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Xóa cookie bằng cách đặt thời gian hết hạn trong quá khứ
      res.setHeader("Set-Cookie", [
        "accessToken=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict",
        "refreshToken=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict",
      ]);

      return res
        .status(200)
        .json({ success: true, message: "Đăng xuất thành công" });
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      return res
        .status(500)
        .json({ success: false, message: "Đã xảy ra lỗi khi đăng xuất" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Phương thức không được hỗ trợ" });
  }
}
