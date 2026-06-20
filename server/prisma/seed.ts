import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const books = [
  { id: 1, itemType: 'book', author: 'Сергій Жадан', title: 'Динамо Харків', image: 'https://book-ye.com.ua/upload/iblock/9fb/e17474bf_2b8a_11e8_80ea_000c29ae1566_6da6499f_71de_11eb_8149_0050568ef5e6.jpg', publisher: 'А-БА-БА-ГА-ЛА-МА-ГА', coverType: 0, year: 2023, isbn: '9786175850657', pageCount: 304, lang: 'українська', price: 350, reducedPrice: 0, isReducedNow: false, category: '0,1,2,3', annotation: 'Вибране Сергія Жадана — найпопулярнішого українського поета нової хвилі.', tags: '0', amount: 10 },
  { id: 2, itemType: 'book', author: 'Тейлор Дженкінс Рід', title: 'Сім чоловіків Евелін Г\'юґо', image: 'https://book-ye.com.ua/upload/iblock/b56/3d4bc7cf_d526_11ed_8182_00505684ea69_6f8cf6a5_fa26_11ed_8183_00505684ea69.jpg', publisher: 'Артбукс', coverType: 0, year: 2023, isbn: '9786175230244', pageCount: 544, lang: 'українська', price: 500, reducedPrice: 0, isReducedNow: false, category: '2', annotation: 'Голлівудська ікона кіно нарешті готова розповісти правду про своє гламурне та скандальне життя.', tags: '0,1', amount: 4 },
  { id: 3, itemType: 'book', author: 'Фредрік Бакман', title: 'Переможці', image: 'https://book-ye.com.ua/upload/resize_cache/iblock/433/520_860_1/de3b8db3_c9ae_11ed_8182_00505684ea69_264a58a8_01ed_11ee_8184_00505684ea69.jpg', publisher: '#книголав', coverType: 0, year: 2023, isbn: '9786178012250', pageCount: 704, lang: 'українська', price: 715, reducedPrice: 500, isReducedNow: true, category: '3', annotation: 'Сильна і зворушлива історія про маленьке містечко.', tags: '0,1', amount: 10 },
  { id: 4, itemType: 'book', author: 'Емілі Генрі', title: 'Пляжне чтиво', image: 'https://book-ye.com.ua/upload/resize_cache/iblock/58c/520_860_1/08f8727e_c954_11ed_8182_00505684ea69_b27c17bd_0c0e_11ee_8185_00505684ea69.jpg', publisher: 'Артбукс', coverType: 0, year: 2023, isbn: '9789661545914', pageCount: 392, lang: 'українська', price: 667, reducedPrice: 449, isReducedNow: true, category: '4', annotation: 'Два письменники-суперники укладають парі на літо.', tags: '1', amount: 0 },
  { id: 5, itemType: 'book', author: 'Стівен Кінг', title: 'Казка', image: 'https://book-ye.com.ua/upload/resize_cache/iblock/295/520_860_1/8b93089b_0067_11ee_8184_00505684ea69_19067cb6_0068_11ee_8184_00505684ea69.jpg', publisher: 'Книжковий клуб «Клуб Сімейного Дозвілля»', coverType: 0, year: 2023, isbn: '9786171500136', pageCount: 752, lang: 'українська', price: 502, reducedPrice: 480, isReducedNow: true, category: '1', annotation: 'Сімнадцятирічний Чарлі Рід знаходить портал у магічний світ.', tags: '1', amount: 10 },
  { id: 6, itemType: 'book', author: 'Брендон Сандерсон', title: 'Небовись', image: 'https://book-ye.com.ua/upload/iblock/b88/2c4b516d_10f6_11ee_8186_00505684ea69_781e69f9_11b4_11ee_8186_00505684ea69.jpg', publisher: 'Nebo BookLab Publishing', coverType: 0, year: 2023, isbn: '9786177914623', pageCount: 472, lang: 'українська', price: 1123, reducedPrice: 720, isReducedNow: true, category: '2', annotation: 'Дівчина-підліток мріє стати пілотом і боротись проти інопланетної раси.', tags: '0', amount: 10 },
  { id: 7, itemType: 'book', author: 'Ребекка Кван', title: 'Вавилон. Прихована історія', image: 'https://book-ye.com.ua/upload/resize_cache/iblock/93b/520_860_1/41e221d9_2faf_11ee_8187_00505684ea69_a9d1b3f0_2faf_11ee_8187_00505684ea69.jpg', publisher: 'Жорж', coverType: 0, year: 2023, isbn: '9786178023805', pageCount: 584, lang: 'українська', price: 638, reducedPrice: 489, isReducedNow: true, category: '7', annotation: 'Історичне фентезі про студентські революції та колоніальний спротив.', tags: '1,2', amount: 10 },
  { id: 8, itemType: 'book', author: 'Дана Шварц', title: 'Анатомія: історія кохання', image: 'https://book-ye.com.ua/upload/iblock/c6f/e15aa121_2faf_11ee_8187_00505684ea69_44a05fcc_2fb3_11ee_8187_00505684ea69.jpg', publisher: 'Жорж', coverType: 0, year: 2023, isbn: '9786178023683', pageCount: 344, lang: 'українська', price: 371, reducedPrice: 280, isReducedNow: true, category: '8', annotation: 'Гейзел хоче стати хірургом більше, ніж вдало вийти заміж.', tags: '1,2', amount: 10 },
  { id: 9, itemType: 'book', author: 'Голлі Вільямс', title: 'Час для кохання', image: 'https://book-ye.com.ua/upload/iblock/19b/d6a3971f_f0c4_11ed_8183_00505684ea69_497a8f21_052c_11ee_8185_00505684ea69.jpg', publisher: 'Vivat', coverType: 0, year: 2023, isbn: '9786171700345', pageCount: 470, lang: 'українська', price: 350, reducedPrice: 261, isReducedNow: true, category: '8', annotation: 'Три історії кохання в різні часи: 1947, 1967 та 1987 роки.', tags: '0', amount: 10 },
  { id: 10, itemType: 'book', author: 'Кейсі Макквістон', title: 'Червоний, білий та королівський синій', image: 'https://book-ye.com.ua/upload/iblock/dec/c21e89f1_3d0d_11ee_8187_00505684ea69_72aed878_3d9f_11ee_8187_00505684ea69.jpg', publisher: 'Артбукс', coverType: 0, year: 2023, isbn: '9786175230688', pageCount: 448, lang: 'українська', price: 600, reducedPrice: 480, isReducedNow: true, category: '1,12', annotation: 'Syn prezydentky США та британський принц змушені вдавати дружбу.', tags: '1', amount: 10 },
  { id: 11, itemType: 'book', author: 'Джулія Беррі', title: 'Скандальне сестринство з Приквіллов-роуд', image: 'https://book-ye.com.ua/upload/iblock/119/7a133e39_ee58_11ed_8183_00505684ea69_af5b82f5_05e3_11ee_8185_00505684ea69.jpg', publisher: 'РМ', coverType: 0, year: 2023, isbn: '9786178248956', pageCount: 344, lang: 'українська', price: 625, reducedPrice: 399, isReducedNow: true, category: '9', annotation: 'Сім вихованок школи ховають трупи директорки.', tags: '1', amount: 10 },
  { id: 12, itemType: 'book', author: 'Сергій Жадан', title: '30 віршів про любов і залізницю', image: 'https://book-ye.com.ua/upload/resize_cache/iblock/d1a/520_860_1/6709f919_fa0d_11ed_8183_00505684ea69_fdc833b2_fa0e_11ed_8183_00505684ea69.jpg', publisher: 'Видавництво Старого Лева', coverType: 0, year: 2023, isbn: '9789664481233', pageCount: 88, lang: 'українська', price: 224, reducedPrice: 183, isReducedNow: true, category: '6', annotation: 'Поезії Жадана про залізницю, мандри, розлуки та зустрічі.', tags: '1,2', amount: 10 },
  { id: 13, itemType: 'merch', title: 'Шопер Alinea Books', image: 'https://m.media-amazon.com/images/I/71Q5C0PqoqL._AC_SL1500_.jpg', price: 299, reducedPrice: 0, isReducedNow: false, annotation: 'Фірмовий шопер книгарні з логотипом.', tags: 'new', amount: 20 },
  { id: 14, itemType: 'merch', title: 'Закладка Alinea', image: 'https://m.media-amazon.com/images/I/71x5ICZ3UzL._AC_SL1500_.jpg', price: 89, reducedPrice: 69, isReducedNow: true, annotation: 'Дерев\'яна закладка з логотипом книгарні.', tags: 'new', amount: 50 },
];

const newsItems = [
  { id: 1, author: 'Редакція', title: 'Відкриття нового читацького сезону', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', showImage: true, publisher: 'Alinea Books', text: 'Раді повідомити про початок нового читацького сезону!', category: 'новини' },
  { id: 2, author: 'Редакція', title: 'Топ книг цього місяця', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800', showImage: true, publisher: 'Alinea Books', text: 'Представляємо добірку найпопулярніших книг місяця.', category: 'огляд' },
  { id: 3, author: 'Редакція', title: 'Нові надходження: українська проза', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800', showImage: true, publisher: 'Alinea Books', text: 'У нашому магазині з\'явились нові книги від українських авторів.', category: 'новини' },
];

async function main() {
  await prisma.role.createMany({
    data: [
      { id: 1, name: 'user' },
      { id: 2, name: 'moderator' },
      { id: 3, name: 'admin' },
      { id: 4, name: 'seller' },
    ],
    skipDuplicates: true,
  });

  let adminUser = await prisma.user.findFirst({ where: { email: 'admin@alinea.com' } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: { email: 'admin@alinea.com', password: bcrypt.hashSync('admin123', 8), name: 'Admin' },
    });
  } else {
    await prisma.user.update({ where: { id: adminUser.id }, data: { password: bcrypt.hashSync('admin123', 8) } });
  }
  await prisma.userRole.createMany({
    data: [
      { roleId: 1, userId: adminUser.id },
      { roleId: 3, userId: adminUser.id },
    ],
    skipDuplicates: true,
  });

  for (const { amount, ...book } of books) {
    const item = await prisma.item.upsert({
      where: { id: book.id },
      update: {},
      create: book as any,
    });
    const existingMgmt = await prisma.item_managements.findFirst({ where: { itemId: item.id } });
    if (!existingMgmt) {
      await prisma.item_managements.create({ data: { itemId: item.id, amount } });
    }
    process.stdout.write('.');
  }

  for (const news of newsItems) {
    await prisma.news.upsert({ where: { id: news.id }, update: {}, create: news });
    process.stdout.write('.');
  }

  console.log('\nSeed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
