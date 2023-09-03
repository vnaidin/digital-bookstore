const express = require("express");
const cors = require("cors");
const path = require('path');

const app = express();
const PORT = process.env.APP_PORT || 3016;

var corsOptions = {
  origin: `http://localhost:${PORT}`
};
require('dotenv').config();

const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Digital Bookstore CRUD",
      description: "Digital Bookstore Application API",
      license: {
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
      },
      version: "1.0.11"
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/`,
      },
    ],
    // schemes: ["http"],
    components: {
      securitySchemes: {
        bearer: {
          type: "http",
          scheme: "bearer",
          in: 'header',
          bearerFormat:'bearer'
        },
      },
    },
  },
  apis: ["./app/routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '..//build')));


// database
const db = require("./app/models");
const Role = db.role;
const User = db.user;
const Book = db.book;

 db.sequelize.sync();
// force: true will drop the table if it already exists
/* db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Database with { force: true }');
   initialDBFill();
 }); */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.route')(app);
require('./app/routes/user.route')(app);
require('./app/routes/book.route')(app);

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initialDBFill() {
  // create roles
  Role.create({
    id: 1,
    name: "user"
  });
  Role.create({
    id: 2,
    name: "moderator"
  });
  Role.create({
    id: 3,
    name: "admin"
  });
  // create some users
  User.create({
    id:1,
    email:'first@google.com',
    password:'first'
  });
  User.create({
    id:2,
    email:'second@google.com',
    password:'second',
    roles: [
      "user",
      "moderator",
    ]
  });
  User.create({
    id:3,
    email:'third@google.com',
    password:'third',
    roles: [
      "user",
      "moderator",
    ]
  });
  // create some books
  Book.create({
    id:1,
    author:'Сергій Жадан',
    title:"Динамо Харків",
    image:"https://book-ye.com.ua/upload/iblock/9fb/e17474bf_2b8a_11e8_80ea_000c29ae1566_6da6499f_71de_11eb_8149_0050568ef5e6.jpg",
    publisher:"А-БА-БА-ГА-ЛА-МА-ГА",
    year:2023,
    isbn:'9786175850657',
    pageCount:304,
    lang:'українська',
    price:350,
    annotation:"До книги вибраного Сергія Жадана (23.08.1974) — найпопулярнішого і найулюбленішого українського поета нової хвилі — увійшли найвідоміші вірші з усіх попередніх збірок, а також нові, ще не публіковані, поезії. Це найповніше на сьогодні вибране поета."
  });
  Book.create({
    id:2,
    author:'Тейлор Дженкінс Рід',
    title:"Сім чоловіків Евелін Г'юґо",
    image:"https://book-ye.com.ua/upload/iblock/b56/3d4bc7cf_d526_11ed_8182_00505684ea69_6f8cf6a5_fa26_11ed_8183_00505684ea69.jpg",
    publisher:"Артбукс",
    year:2023,
    isbn:'9786175230244',
    pageCount:544,
    lang:'українська',
    price:500,
    annotation:'Уже літня та замкнута в собі голлівудська ікона кіно Евелін Хьюго нарешті готова розповісти правду про своє гламурне та скандальне життя. Але коли вона обирає на цю роботу невідому журналістку Монік Грант, дивуються всі. Незалежно від того, чому Евелін вибрала її для написання своєї біографії, Монік рішуче використовує цю можливість, аби розпочати свою кар’єру. Вона захоплено слухає, як акторка розповідає свою історію про сімох чоловіків, нещадні амбіції, темні сторони старого Голлівуду та велике заборонене кохання. Монік починає відчувати цілком реальний зв’язок із легендарною зіркою, але коли історія Евелін наближається до свого завершення, стає зрозуміло, що їхнє життя перетинається трагічними та незворотними шляхами.'
  });
  Book.create({
    id:3,
    author:'Фредрік Бакман',
    title:"Переможці",
    image:"https://book-ye.com.ua/upload/resize_cache/iblock/433/520_860_1/de3b8db3_c9ae_11ed_8182_00505684ea69_264a58a8_01ed_11ee_8184_00505684ea69.jpg",
    publisher:"#книголав",
    year:2023,
    isbn:'9786178012250',
    pageCount:704,
    lang:'українська',
    price:715,
    reducedPrice:500,
    isReducedNow:true,
    annotation:'Сильна і зворушлива історія, події якої відбуваються у маленькому містечку. Вона про жорстокість і чуттєвість, про вірність і відданість, про насильство і дружбу, про прагнення помсти й жагу до ПЕРЕМОГИ. Книжка від автора бестселерів № 1 за версією New York Times, на яку зачекався увесь український буктюб і не тільки. «Переможці» — завершальна частина трилогії про хокейну команду та життя містечка Бйорнстад. Сюжет: Минуло два роки після подій, які досі ніхто не хоче згадувати. Кожен намагався йти далі, але в цьому місті завжди щось цьому заважає. Мешканці хокейного містечка продовжують шукати відповіді на найважливіші запитання: Що таке сім’я? Що таке спільнота? І чим вони готові пожертвувати, щоб захистити їх? Поки жителі містечка Бйорнстад намагаються подолати минуле, великі зміни вже на горизонті. Хтось повертається додому після тривалої відсутності, хтось закохається, хтось спробує налагодити шлюб, а хтось піде на все, щоб врятувати своїх дітей...'
  });
  Book.create({
    id:4,
    author:'Емілі Генрі',
    title:"Пляжне чтиво",
    image:"https://book-ye.com.ua/upload/resize_cache/iblock/58c/520_860_1/08f8727e_c954_11ed_8182_00505684ea69_b27c17bd_0c0e_11ee_8185_00505684ea69.jpg",
    publisher:"Артбукс",
    year:2023,
    isbn:'9789661545914',
    pageCount:392,
    lang:'українська',
    price:667,
    reducedPrice:449,
    isReducedNow:true,
    annotation:'Оґастус Еверет — знаний прозаїк. Дженьюері Ендрюс — авторка романтичних бестселерів. Поки вона виписує свої «Довго й щасливо», він убиває всіх персонажів. У них немає нічого спільного. Хоча ні, є одне: найближчі три місяці їм доведеться прожити в сусідніх будинках, страждаючи кожен від своєї життєвої драми і на додачу ще й від творчої кризи. Якось так стається, що одного туманного вечора вони укладають парі, що має вивести їх із глухого кута: Оґастус протягом літа напише щось життєрадісне, а Дженьюері спробує створити новий «великий американський роман». Вона щосуботи організовуватиме йому вечори як у романтичних комедіях, а він влаштує їй інтерв’ю з вцілілими учасниками смертельного культу (а чому б ні?). Кожен закінчить свою книжку, і ніхто не закохається. Точно-точно.'
  });
  Book.create({
    id:5,
    author:'Тейлор Дженкінс Рід',
    title:"Світанок Малібу",
    image:"https://book-ye.com.ua/upload/iblock/02d/3119ce08_1f33_11ee_8187_00505684ea69_2ab403c6_40ba_11ee_8187_00505684ea69.jpg",
    publisher:"Артбукс",
    year:2023,
    isbn:'9786175230459',
    pageCount:472,
    lang:'українська',
    price:742,
    reducedPrice:499,
    isReducedNow:true,
    annotation:'Четверо знаменитих братів і сестер влаштовують епічну вечірку на завершення літа… Мине лише двадцять чотири години, а їхні життя зміняться назавжди. Малібу. Серпень 83-го. Довгоочікуваний день традиційної літньої вечірки в Ніни Ріви. Потрапити на вечірку хочуть всі – адже всім кортить побувати в зірковому товаристві Рів. Ніна – талановита серферка й фотомодель. Брати Джей і Гуд – чемпіон з серфінгу й видатний фотограф. І їхня маленька пестунка, Кіт. Цю четвірку обожнюють не в лише в Малібу, але у всьому світі – тим паче, вони нащадки легендарного співака Міка Ріви. От тільки цьогоріч Ніні зовсім не хочеться, аби цей день настав. Гуд теж не в захваті, Джей, навпаки, рахує хвилини, а Кіт має кілька секретів. Вже опівночі вечірка цілковито вийде з-під контролю. А вранці особняк ущент згорить. Але до того часу рікою тектиме спиртне, гратиме музика, відкриватимуться таємниці й любовні історії, в яких народжувалися й якими жили кілька поколінь цієї родини. Допоки на світанку не спалахне перша іскра.'
  });
}