"use client"

import { useState } from "react"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Send } from "lucide-react"

// --- Thay info của mày ở đây ---
const EMAILJS_SERVICE_ID = "service_t5uxgqc"
const EMAILJS_TEMPLATE_ID = "template_9r5hza7"
const EMAILJS_PUBLIC_KEY = "jDLXDlrmmaCwOBcIO"
const ADMIN_NAME = "Vinh" // Tên người nhận góp ý (to_name)
// -------------------------------

export function FeedbackForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    to_name: ADMIN_NAME, // luôn truyền field này lên EmailJS
  })

  // Xử lý nhập
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Đảm bảo khi nhập vẫn giữ đúng ADMIN_NAME cho to_name
      to_name: ADMIN_NAME,
    }))
  }

  // Xử lý gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formData,
        EMAILJS_PUBLIC_KEY
      )
      setIsSubmitted(true)
    } catch (err: any) {
      setError("Lỗi gửi mail, thử lại!")
    } finally {
      setIsLoading(false)
    }
  }

  // Nếu gửi thành công
  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Cảm ơn đã góp ý!</h2>
          <Button onClick={() => setIsSubmitted(false)}>Gửi tiếp</Button>
        </CardContent>
      </Card>
    )
  }

  // UI Form
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gửi góp ý</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Tên người gửi */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên bạn</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          {/* Email người gửi */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          {/* Loại góp ý */}
          <div className="space-y-2">
            <Label htmlFor="category">Loại góp ý</Label>
            <select
              id="category"
              value={formData.category}
              onChange={e => handleInputChange("category", e.target.value)}
              required
              className="w-full rounded border p-2 bg-background"
            >
              <option value="" disabled>Chọn loại</option>
              <option value="bug">Lỗi/Bug</option>
              <option value="feature">Tính năng mới</option>
              <option value="content">Nội dung</option>
              <option value="general">Góp ý chung</option>
            </select>
          </div>

          {/* Tiêu đề góp ý */}
          <div className="space-y-2">
            <Label htmlFor="subject">Tiêu đề</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              required
            />
          </div>

          {/* Nội dung góp ý */}
          <div className="space-y-2">
            <Label htmlFor="message">Nội dung</Label>
            <Textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
            />
          </div>

          {/* Nút gửi */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang gửi..." : (<><Send className="h-4 w-4 mr-2" />Gửi góp ý</>)}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
