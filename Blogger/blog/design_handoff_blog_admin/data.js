/* ============================================================
   Sample content — warm personal/literary Vietnamese blog
   (Placeholder content for the prototype; not real people.)
   ============================================================ */

window.BLOG = {
  site: {
    title: "Sổ Tay Của Mây",
    tagline: "Những mẩu chuyện nhỏ về gia đình, những chuyến đi và ngày thường",
    author: "Mây Nguyễn",
    authorBio:
      "Mình viết để giữ lại những điều dễ quên — mùi cà phê sáng, tiếng mưa trên mái tôn, một câu nói của mẹ. Blog này là cuốn sổ tay mình mở ra cho bạn cùng đọc.",
    email: "may@sotaycuamay.com",
  },

  // tag slugs -> display
  tags: {
    "gia-dinh": "Gia đình",
    "du-lich": "Du lịch",
    "ngay-thuong": "Ngày thường",
    "tan-van": "Tản văn",
    "bep-nha": "Bếp nhà",
    "tuoi-tre": "Tuổi trẻ",
  },

  posts: [
    {
      id: "p1",
      slug: "tuoi-ham-hai",
      title: "Tuổi hăm hai",
      excerpt:
        "Hăm hai tuổi, mình học cách ngồi yên với những điều chưa có câu trả lời, và thấy điều đó cũng chẳng sao.",
      cover: { hue: 24, label: "Ảnh bìa — quán cà phê chiều" },
      date: "2026-05-18",
      readMins: 6,
      views: 2841,
      tags: ["tuoi-tre", "tan-van"],
      featured: true,
      status: "published",
      body: [
        { t: "p", v: "Có những buổi chiều mình ngồi ở ban công, nhìn nắng rút dần khỏi bức tường nhà đối diện, và tự hỏi không biết mình đang làm gì với tuổi trẻ của mình. Hăm hai tuổi — cái tuổi mà ai cũng bảo là đẹp nhất, nhưng chẳng ai nói trước rằng nó cũng chông chênh đến vậy." },
        { t: "p", v: "Mình từng nghĩ đến tuổi này thì mọi thứ phải rõ ràng: một công việc ổn định, một con đường thẳng tắp, một câu trả lời cho câu hỏi “sau này con định làm gì”. Nhưng hóa ra, hăm hai tuổi là khi mình học cách ngồi yên với những điều chưa có câu trả lời." },
        { t: "h2", v: "Những điều không ai dạy" },
        { t: "p", v: "Không ai dạy mình rằng có những tình bạn rồi sẽ nhạt đi, không phải vì ai sai, mà chỉ vì hai người đi về hai phía khác nhau. Không ai dạy mình cách gọi điện về nhà khi thấy nhớ mà cổ họng lại nghẹn lại." },
        { t: "quote", v: "Trưởng thành không phải là biết hết mọi câu trả lời, mà là thôi sợ những câu hỏi." },
        { t: "p", v: "Và mình nhận ra, điều đó cũng chẳng sao cả. Mình vẫn dậy mỗi sáng, pha một ly cà phê, mở cuốn sổ ra và viết vài dòng. Từng ngày nhỏ như vậy, gom lại, cũng thành một tuổi trẻ tử tế." },
      ],
    },
    {
      id: "p2",
      slug: "ba-toi-va-chiec-xe-cup",
      title: "Ba tôi và chiếc xe Cub",
      excerpt:
        "Chiếc Cub 81 màu mận chín đã chở cả tuổi thơ tôi đi học, và chở ba tôi đi qua những năm tháng khó nhọc nhất.",
      cover: { hue: 8, label: "Ảnh bìa — chiếc xe Cub cũ" },
      date: "2026-05-09",
      readMins: 7,
      views: 4120,
      tags: ["gia-dinh", "tan-van"],
      featured: true,
      status: "published",
      body: [
        { t: "p", v: "Nhà mình có một chiếc Honda Cub 81 màu mận chín, ba mua từ trước khi mình ra đời. Cái xe ấy đã cũ đến mức tiếng nổ giòn tan của nó vang lên đầu ngõ là cả xóm biết ba mình về." },
        { t: "p", v: "Suốt mười hai năm đi học, mình ngồi sau lưng ba trên chiếc Cub ấy. Mùa đông ba cởi áo khoác choàng ra sau cho mình đỡ lạnh, còn ba thì run trong chiếc áo sơ mi mỏng." },
        { t: "h2", v: "Cái yên xe mòn vẹt" },
        { t: "p", v: "Bây giờ ba đã có tuổi, chiếc Cub cũng nằm im trong góc nhà, cái yên mòn vẹt một bên. Mỗi lần về quê, mình lại dắt nó ra, đạp nổ máy, nghe lại cái tiếng giòn tan ngày cũ." },
        { t: "quote", v: "Có những món đồ cũ không phải để dùng nữa, mà để nhớ." },
        { t: "p", v: "Ba bảo chừng nào ba còn khỏe thì còn giữ. Mình hiểu, giữ chiếc xe cũng là giữ một phần những năm tháng ba còn trẻ, còn gánh cả nhà trên hai bánh xe nhỏ." },
      ],
    },
    {
      id: "p3",
      slug: "mot-minh-o-da-lat",
      title: "Một mình ở Đà Lạt",
      excerpt:
        "Chuyến đi đầu tiên mình đi một mình. Hóa ra ở một mình giữa thành phố sương cũng là một cách để gặp lại chính mình.",
      cover: { hue: 150, label: "Ảnh bìa — đồi thông Đà Lạt" },
      date: "2026-04-27",
      readMins: 8,
      views: 5390,
      tags: ["du-lich", "tan-van"],
      featured: false,
      status: "published",
      body: [
        { t: "p", v: "Mình bắt chuyến xe đêm lên Đà Lạt, không hẹn trước với ai, không lịch trình, chỉ mang theo một ba lô nhỏ và cuốn sổ tay quen thuộc." },
        { t: "p", v: "Buổi sáng đầu tiên, mình ngồi ở một quán cà phê nhìn ra hồ, sương còn chưa tan. Lạ lùng là cảm giác cô đơn mà mình vẫn sợ, ở đây lại hóa thành một sự bình yên." },
        { t: "h2", v: "Đi để chậm lại" },
        { t: "p", v: "Mình đi bộ qua những con dốc, ghé vào một tiệm sách cũ, mua một quyển thơ, ngồi đọc đến chiều. Không điện thoại, không deadline, chỉ có mình và tiếng gió qua rặng thông." },
        { t: "quote", v: "Đôi khi phải đi thật xa khỏi mọi người, mới nghe rõ được tiếng nói của chính mình." },
        { t: "p", v: "Ngày về, mình mang theo không phải quà cáp, mà là một cảm giác nhẹ nhõm hiếm hoi — rằng mình hoàn toàn ổn khi chỉ có một mình." },
      ],
    },
    {
      id: "p4",
      slug: "noi-canh-mam-cua-me",
      title: "Nồi canh mẳn của mẹ",
      excerpt:
        "Mẹ nấu canh hơi mặn, ba ăn mãi không quen mà chẳng bao giờ chê. Bữa cơm nhà mình ngon vì điều đó.",
      cover: { hue: 36, label: "Ảnh bìa — mâm cơm gia đình" },
      date: "2026-04-15",
      readMins: 5,
      views: 3270,
      tags: ["gia-dinh", "bep-nha"],
      featured: false,
      status: "published",
      body: [
        { t: "p", v: "Mẹ mình nấu ăn ngon, chỉ mỗi tội hay tay mặn. Nồi canh nào của mẹ cũng đậm đà hơn người ta một chút, mà ba thì cả đời ăn nhạt." },
        { t: "p", v: "Vậy mà suốt mấy chục năm, mình chưa từng nghe ba chê một câu. Ba chỉ lặng lẽ chan thêm chút nước lọc vào bát canh của mình, rồi khen mẹ nấu khéo." },
        { t: "quote", v: "Thương nhau là biết nêm bớt cái tôi của mình lại một chút." },
        { t: "p", v: "Sau này lớn lên mình mới hiểu, bữa cơm nhà ngon không phải vì nồi canh vừa miệng, mà vì người ta chịu ăn mặn cùng nhau cả một đời." },
      ],
    },
    {
      id: "p5",
      slug: "mua-thang-sau",
      title: "Mưa tháng sáu",
      excerpt:
        "Sài Gòn vào mưa. Mình đứng dưới mái hiên một tiệm tạp hóa, đợi mưa tạnh, và bỗng thấy thành phố dịu dàng lạ.",
      cover: { hue: 210, label: "Ảnh bìa — phố Sài Gòn mùa mưa" },
      date: "2026-06-02",
      readMins: 4,
      views: 0,
      tags: ["ngay-thuong", "tan-van"],
      featured: false,
      status: "draft",
      body: [
        { t: "p", v: "Cơn mưa đầu mùa ập xuống lúc mình vừa ra khỏi cơ quan. Không kịp mặc áo mưa, mình tấp vội vào mái hiên một tiệm tạp hóa ven đường." },
        { t: "p", v: "Bà chủ tiệm rót cho mình ly trà nóng, bảo cứ đứng đây đợi, mưa Sài Gòn nhanh tạnh lắm. Mình đứng nhìn nước chảy thành dòng dưới lòng đường, nghe tiếng mưa rào rào trên mái tôn." },
        { t: "p", v: "(Bài viết còn đang dở — mình sẽ viết tiếp đoạn về những người cùng trú mưa hôm ấy.)" },
      ],
    },
    {
      id: "p6",
      slug: "can-phong-tro-dau-tien",
      title: "Căn phòng trọ đầu tiên",
      excerpt:
        "Mười tám tuổi, lần đầu xa nhà, căn phòng trọ chật hẹp ấy lại dạy mình nhiều hơn cả giảng đường.",
      cover: { hue: 280, label: "Ảnh bìa — phòng trọ sinh viên" },
      date: "2026-03-30",
      readMins: 6,
      views: 2980,
      tags: ["tuoi-tre", "ngay-thuong"],
      featured: false,
      status: "published",
      body: [
        { t: "p", v: "Căn phòng trọ đầu tiên của mình rộng chừng mười hai mét vuông, có một ô cửa sổ nhìn ra bức tường nhà bên cạnh. Tiền nhà một triệu hai, mình chia với một đứa bạn cùng quê." },
        { t: "p", v: "Mùa hè nóng như đổ lửa, mùa mưa thì dột một góc. Nhưng chính trong căn phòng ấy, mình học cách tự lo cho mình: tự nấu cơm, tự dỗ mình ngủ những đêm nhớ nhà." },
        { t: "quote", v: "Trưởng thành bắt đầu từ cái ngày mình tự thay được cái bóng đèn cháy." },
        { t: "p", v: "Giờ mình đã chuyển đi nơi khác rộng rãi hơn, nhưng thi thoảng đi ngang con hẻm cũ, mình vẫn ngước lên tìm ô cửa sổ ngày xưa." },
      ],
    },
  ],

  // guest comments, keyed by post slug.
  // status: visible | pending | spam   ·   replies nest one level
  comments: {
    "tuoi-ham-hai": [
      { id: "c1", name: "Lan Anh", date: "2026-05-19", likes: 12, liked: false, status: "visible",
        text: "Đọc mà thấy như đang đọc chính mình của vài năm trước. Cảm ơn Mây đã viết ạ.",
        replies: [
          { id: "r1", name: "Mây Nguyễn", author: true, date: "2026-05-19", likes: 4, liked: false, status: "visible",
            text: "Cảm ơn bạn đã ghé đọc nhé. Tuổi nào rồi cũng sẽ qua, mình cứ tử tế với chính mình là được." },
        ] },
      { id: "c2", name: "Hoàng Minh", date: "2026-05-20", likes: 8, liked: false, status: "visible",
        text: "“Thôi sợ những câu hỏi” — câu này hay quá. Mình sẽ ghi lại.", replies: [] },
      { id: "c3", name: "Thu", date: "2026-05-22", likes: 2, liked: false, status: "visible",
        text: "Hăm hai tuổi đọc bài này đúng lúc luôn. Lưu lại đọc dần.", replies: [] },
      { id: "c8", name: "Bình", date: "2026-05-24", likes: 0, liked: false, status: "pending",
        text: "Cho mình hỏi bạn thường viết vào lúc nào trong ngày vậy ạ?", replies: [] },
      { id: "c9", name: "Khuyến Mãi Sốc", date: "2026-05-25", likes: 0, liked: false, status: "spam",
        text: "Giảm giá 90% inbox ngay số 09xx, hàng có sẵn ship toàn quốc!!!", replies: [] },
    ],
    "ba-toi-va-chiec-xe-cup": [
      { id: "c4", name: "Đức", date: "2026-05-10", likes: 15, liked: false, status: "visible",
        text: "Nhà mình cũng có chiếc Cub y hệt vậy. Đọc xong muốn về quê ngay.",
        replies: [
          { id: "r2", name: "Mây Nguyễn", author: true, date: "2026-05-10", likes: 2, liked: false, status: "visible",
            text: "Về thăm ba mẹ đi bạn ơi, mấy chuyến về nhà chẳng bao giờ là thừa cả." },
        ] },
      { id: "c5", name: "Phương Vy", date: "2026-05-12", likes: 6, liked: false, status: "visible",
        text: "Khóc mất rồi. Thương ba quá.", replies: [] },
    ],
    "mot-minh-o-da-lat": [
      { id: "c6", name: "Nam", date: "2026-04-28", likes: 4, liked: false, status: "visible",
        text: "Đi một mình đúng là một trải nghiệm rất khác. Bài viết chạm thật.", replies: [] },
    ],
  },
};
