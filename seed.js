// Using native fetch in Node.js 18+

const API_BASE = "http://localhost:8080";

async function runSeeder() {
  console.log("🚀 Bắt đầu quá trình import thêm nhiều dữ liệu...");
  
  // 1. Đăng nhập Admin
  console.log("Đang đăng nhập bằng tài khoản admin...");
  const loginRes = await fetch(`${API_BASE}/auth/staff/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin123" })
  });
  
  if (!loginRes.ok) {
    console.error("❌ Đăng nhập thất bại.");
    return;
  }
  
  const loginData = await loginRes.json();
  const tokenType = loginData.tokenType || "Bearer";
  const token = loginData.token || loginData.accessToken || loginData;
  const authHeader = typeof token === 'string' ? `${tokenType} ${token}` : `${tokenType} ${token.token}`;

  console.log("✅ Đăng nhập thành công! Lấy token hợp lệ.");

  // 2. Import Categories
  const categories = [
    { name: "Massage Phục Hồi", description: "Các dịch vụ massage toàn thân, trị liệu cổ vai gáy", isActive: true },
    { name: "Chăm Sóc Da", description: "Liệu trình làm sạch, dưỡng ẩm, trị mụn và trẻ hóa", isActive: true },
    { name: "Gội Đầu Dưỡng Sinh", description: "Chăm sóc tóc và da đầu bằng thảo dược", isActive: true },
    { name: "Nail Nghệ Thuật", description: "Sơn gel, đắp bột, vẽ hoa văn chuyên nghiệp", isActive: true },
    { name: "Dịch Vụ Cao Cấp", description: "Tắm trắng, triệt lông và liệu trình spa toàn diện", isActive: true }
  ];

  const categoryIds = [];

  console.log("Đang tạo danh mục...");
  for (const cat of categories) {
    const res = await fetch(`${API_BASE}/api/categories`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(cat)
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Đã tạo danh mục: ${cat.name} (ID: ${data.id})`);
      categoryIds.push(data.id);
    } else {
      console.error(`❌ Tạo danh mục ${cat.name} thất bại:`, await res.text());
    }
  }

  // 3. Import Services (Products in backend)
  if (categoryIds.length === 5) {
    console.log("Đang tạo thêm hàng loạt dịch vụ spa...");
    const services = [
      // Cat 0: Massage Phục Hồi
      {
        name: "Massage Body Trị Liệu Đá Nóng",
        description: "Giải tỏa căng thẳng tối đa với đôi tay điêu luyện kết hợp sức nóng từ đá núi lửa.",
        regularPrice: 450000, salePrice: 390000, stock: 100, categoryIds: [categoryIds[0]], isActive: true,
        variants: [{ name: "60 phút", price: 450000, duration: 60 }, { name: "90 phút", price: 600000, duration: 90 }],
        attributes: [{ name: "Loại phòng", value: "Phòng VIP" }]
      },
      {
        name: "Massage Cổ Vai Gáy Chuyên Sâu",
        description: "Phương pháp ấn huyệt đông y giúp đả thông kinh lạc vùng cổ vai gáy.",
        regularPrice: 250000, salePrice: 200000, stock: 100, categoryIds: [categoryIds[0]], isActive: true,
        variants: [{ name: "45 phút", price: 250000, duration: 45 }],
        attributes: [{ name: "Kỹ thuật", value: "Ấn huyệt y học cổ truyền" }]
      },
      {
        name: "Ngâm Chân Thảo Dược & Massage Chân",
        description: "Thư giãn đôi bàn chân bằng thảo dược quý giúp ngủ ngon và sâu giấc.",
        regularPrice: 150000, salePrice: null, stock: 100, categoryIds: [categoryIds[0]], isActive: true,
        variants: [{ name: "30 phút", price: 150000, duration: 30 }],
        attributes: []
      },

      // Cat 1: Chăm sóc da
      {
        name: "Lấy Nhân Mụn Y Khoa Không Sưng Viêm",
        description: "Làm sạch sâu bã nhờn, lấy mụn chuẩn y khoa kết hợp chiếu đèn diệt khuẩn.",
        regularPrice: 300000, salePrice: 249000, stock: 100, categoryIds: [categoryIds[1]], isActive: true,
        variants: [{ name: "60 phút", price: 300000, duration: 60 }],
        attributes: [{ name: "Tính năng", value: "Trị mụn, làm sạch" }]
      },
      {
        name: "Phi Kim Tế Bào Gốc Trẻ Hóa Da",
        description: "Tái tạo làn da không tuổi, làm mờ vết thâm nám và se khít lỗ chân lông.",
        regularPrice: 850000, salePrice: 699000, stock: 100, categoryIds: [categoryIds[1]], isActive: true,
        variants: [{ name: "90 phút", price: 850000, duration: 90 }],
        attributes: [{ name: "Kết quả", value: "Da căng bóng" }]
      },
      {
        name: "Đắp Mặt Nạ Collagen Khóa Ẩm",
        description: "Nạp nước tức thì cho làn da căng bóng mịn màng với nạ Collagen sống.",
        regularPrice: 200000, salePrice: 150000, stock: 100, categoryIds: [categoryIds[1]], isActive: true,
        variants: [{ name: "30 phút", price: 200000, duration: 30 }],
        attributes: []
      },

      // Cat 2: Gội đầu
      {
        name: "Gội Đầu Dưỡng Sinh Cơ Bản",
        description: "Làm sạch tóc và da đầu chiết xuất từ bồ kết, xả, chanh, gừng.",
        regularPrice: 100000, salePrice: 80000, stock: 100, categoryIds: [categoryIds[2]], isActive: true,
        variants: [{ name: "45 phút", price: 100000, duration: 45 }],
        attributes: [{ name: "Sản phẩm", value: "100% Thuần chay tự nhiên" }]
      },
      {
        name: "Gội Đầu Dưỡng Sinh Hoàng Cung",
        description: "Kết hợp massage cổ vai gáy và ngâm chân trong chu trình gội.",
        regularPrice: 250000, salePrice: 199000, stock: 100, categoryIds: [categoryIds[2]], isActive: true,
        variants: [{ name: "75 phút", price: 250000, duration: 75 }],
        attributes: []
      },

      // Cat 3: Nail
      {
        name: "Sơn Gel Cao Cấp Hàn Quốc",
        description: "Gồm bước cắt da, dũa form, sơn gel OPI màu sắc trendy nhất.",
        regularPrice: 150000, salePrice: null, stock: 100, categoryIds: [categoryIds[3]], isActive: true,
        variants: [{ name: "45 phút", price: 150000, duration: 45 }],
        attributes: [{ name: "Hãng sơn", value: "OPI, VeryGood Nail" }]
      },
      {
        name: "Chà Gót Chân Làm Sáng Da",
        description: "Sạch bong lớp da chết ở gót chân, trả lại đôi chân hồng hào mềm mại.",
        regularPrice: 100000, salePrice: null, stock: 100, categoryIds: [categoryIds[3]], isActive: true,
        variants: [{ name: "30 phút", price: 100000, duration: 30 }],
        attributes: []
      },
      {
        name: "Nối Mi Búp Bê Tự Nhiên",
        description: "Nối mi từng sợi nhẹ nhàng siêu bền, không cộm mắt.",
        regularPrice: 200000, salePrice: 160000, stock: 100, categoryIds: [categoryIds[3]], isActive: true,
        variants: [{ name: "60 phút", price: 200000, duration: 60 }],
        attributes: []
      },

      // Cat 4: Dịch vụ cao cấp
      {
        name: "Tắm Trắng Phi Thuyền Xứ Hàn",
        description: "Nâng 2-3 tone da cực kỳ an toàn, đều màu với phương pháp hấp trắng phi thuyền.",
        regularPrice: 1200000, salePrice: 850000, stock: 100, categoryIds: [categoryIds[4]], isActive: true,
        variants: [{ name: "120 phút", price: 1200000, duration: 120 }],
        attributes: [{ name: "Cam kết", value: "Không hồi tone" }]
      },
      {
        name: "Triệt Lông Lạnh Diode Laser Vùng Nách",
        description: "Bảo hành 5 năm không mọc lại, công nghệ làm lạnh không rát.",
        regularPrice: 500000, salePrice: 350000, stock: 100, categoryIds: [categoryIds[4]], isActive: true,
        variants: [{ name: "20 phút", price: 500000, duration: 20 }],
        attributes: []
      },
      {
        name: "Triệt Lông Lạnh Diode Laser Toàn Thân",
        description: "Gói tiết kiệm triệt toàn thân không giới hạn số lần bắn.",
        regularPrice: 5500000, salePrice: 3990000, stock: 10, categoryIds: [categoryIds[4]], isActive: true,
        variants: [{ name: "1 Liệu trình", price: 5500000, duration: 120 }],
        attributes: [{ name: "Bảo hành", value: "Trọn đời" }]
      }
    ];

    for (const srv of services) {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": authHeader
        },
        body: JSON.stringify(srv)
      });
      if (res.ok) {
        console.log(`✅ Đã tạo dịch vụ mới: ${srv.name}`);
      } else {
        console.error(`❌ Tạo dịch vụ ${srv.name} thất bại:`, await res.text());
      }
    }
  }
  
  console.log("🎉 XOng! Toàn bộ 14 dịch vụ phong phú đã được bơm vào CSDL!");
}

runSeeder();
