type QuoteItem = {
  text: string;
  source: string;
};

const quotes: QuoteItem[] = [
  {
    text: "Lối sống giản dị, tiết kiệm. Dù là Chủ tịch nước, Bác chỉ ở căn nhà sàn gỗ đơn sơ (1958) bên cạnh Phủ Chủ tịch, ăn uống giản dị: cơm, cá kho, rau luộc, cà muối.",
    source:
      "Nguồn: Viện Hồ Chí Minh, Hồ Chí Minh Toàn tập, tập 10, NXB Chính trị quốc gia, 2011.",
  },
  {
    text: "Không nhận đặc quyền, đặc lợi. Năm 1946, khi Quốc hội quyết định tăng lương cho Chủ tịch nước, Bác từ chối và đề nghị dùng số tiền đó để giúp đồng bào nghèo.",
    source:
      "Nguồn: Trần Dân Tiên, Những mẩu chuyện về đời hoạt động của Hồ Chủ tịch, NXB Sự Thật, 1975.",
  },
  {
    text: "Chí công vô tư. Có lần Bác Hồ xin Bộ Chính trị mua chiếc máy chữ mới cho công việc, sau đó lại đề nghị trả tiền bằng tiền lương cá nhân vì đó là tài sản riêng, không được dùng công quỹ.",
    source:
      "Nguồn: Ban Nghiên cứu Lịch sử Đảng Trung ương, Bác Hồ với những việc làm thường ngày, NXB Sự Thật, 1985.",
  },
  {
    text: "Tình thương yêu nhân dân, đặc biệt là thiếu nhi. Mỗi dịp Tết Trung thu, Bác đều gửi thư cho thiếu nhi cả nước. Thư Trung thu năm 1952 Người viết: “Trẻ em như búp trên cành. Biết ăn, biết ngủ, biết học hành là ngoan”.",
    source:
      "Nguồn: Hồ Chí Minh Toàn tập, tập 8, NXB Chính trị quốc gia, 2011.",
  },
  {
    text: "Tinh thần học tập, lao động. Dù tuổi cao và rất bận rộn, Bác vẫn tự học ngoại ngữ, đọc sách mỗi ngày. Người từng nói: “Học hỏi là một việc phải tiếp tục suốt đời”.",
    source:
      "Nguồn: Hồ Chí Minh Toàn tập, tập 5, NXB Chính trị quốc gia, 2011.",
  },
  {
    text: "Gắn bó với nhân dân. Những năm 1941–1945 ở Pác Bó (Cao Bằng), Bác sống trong hang núi, cùng nhân dân ăn măng, uống nước suối, nằm hang đá, chia sẻ khó khăn trong kháng chiến.",
    source:
      "Nguồn: Trần Dân Tiên, Những mẩu chuyện về đời hoạt động của Hồ Chủ tịch, NXB Sự Thật, 1975.",
  },
];
export default function Quote() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950">
      <h2 className="text-3xl font-bold text-center mb-12 text-emerald-700 dark:text-emerald-300">
        Hồ Chí Minh - tấm gương sáng ngời của nhân dân Việt Nam
      </h2>

      {/* Grid 2 rows, 3 cols */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {quotes.map((quote, index) => (
          <div
            key={index}
            className="relative rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:border-emerald-400"
          >
            {/* Quote icon mờ phía sau */}
            <span className="absolute top-4 right-6 text-6xl text-emerald-200/40 dark:text-emerald-700/40 pointer-events-none select-none">
              “
            </span>

            <p className="relative italic text-gray-800 dark:text-gray-200 text-lg leading-relaxed z-10">
              {quote.text}
            </p>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300/40 dark:border-gray-700 pt-2">
              — {quote.source}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}