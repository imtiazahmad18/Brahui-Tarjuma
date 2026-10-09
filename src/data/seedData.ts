import { Article, CategorySlug, Writer, StaticPageData } from "@/types";

export const SEED_WRITERS: Writer[] = [
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    name: "Saadat Hasan Manto (سعادت حسن منٹو)",
    slug: "saadat-hasan-manto",
    bio: "One of the greatest 20th-century short-story writers in Urdu literature, renowned for his psychological realism, courage, and searing exploration of human nature.",
    photo_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    name: "Faiz Ahmad Faiz (فیض احمد فیض)",
    slug: "faiz-ahmad-faiz",
    bio: "Celebrated progressive poet, intellectual, and humanist whose lyrical verse combined classic ghazal aesthetics with socialist liberation ideals.",
    photo_url: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
    name: "Jorge Luis Borges (خورخے لوئیس بورخیس)",
    slug: "jorge-luis-borges",
    bio: "Master Argentine writer, essayist, and librarian whose labyrinthine fictions and philosophical essays redefined modern world literature.",
    photo_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
    name: "Ernest Hemingway (ارنسٹ ہیمنگوے)",
    slug: "ernest-hemingway",
    bio: "Nobel Prize-winning American novelist and journalist noted for his economical prose style and deep explorations of resilience and mortality.",
    photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
  },
];

export const SEED_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "ٹوبہ ٹیک سنگھ",
    subtitle: "سعادت حسن منٹو نا شاہکار کسّہ نا براہوئی مٹ و بدل",
    slug: "toba-tek-singh",
    category: "fiction",
    body: `بٹوارہ نا دو سال پد ہند و پاکستان نا حکومت آتے دا خیال بس کہ اخلاقی بندی تا وڑ پاگل خاناتیٹی ارادہ مروک پاگل تا تبادلہ کننگے۔ یعنی ہندو و سکھ پاگل آتے ہندوستان روانہ کننگے و مسلمان پاگل آتے پاکستان راہی کننگے۔

لاہور نا پاگل خانہ ٹی ایلو پاگل تا وڑ اسہ پاگل اس بس ہرانا پن بشن سنگھ ئس، ولے کل اودے "ٹوبہ ٹیک سنگھ" پاریرہ۔ او پندرہ سال آن دا پاگل خانہ ٹی ئس۔ او اسل گپتوفکہ، ہروخت تینا تینٹ دا ہیت آتے تکرار کریکہ: "اوپڑی گڑگڑ دی اناکس دی بے دھیانا دی منگ دی دال آف دی لالٹین"۔

بشن سنگھ ہروخت تینا وطن ٹوبہ ٹیک سنگھ نا باروٹ سوج کریکہ۔ کس اس اودے پاتو کہ ٹوبہ ٹیک سنگھ دا وختی ہندوستان ٹی ءِ یا پاکستان ٹی۔ ہروخت کہ ملوک بندغ آک بنارہ، او بیرہ تینا خلق نا سوج ءِ کریکہ۔

آخر تبادلہ نا دے بس۔ واگہ بارڈر آ ساہت خڑک مس۔ بشن سنگھ آن سوج مس تو اودے پاننگا کہ نات وطن ہندوستان ٹی ہنا۔ بشن سنگھ گام اس مونا ہننگ نا خاہشدار متو، او واپس پدی تس۔ او ہڑتوملے ملک آتا نیام نا ڈیہہ آ سلوک مس۔

صبح آن مست، او بے جان مروک ڈغار آ خلیس۔ ہندا ڈیہہ آ کہ ہرانا نہ کس اس پاکستان پن تخاسس، نہ ہندوستان۔ او ہندا نیامی ڈغار آ ندر مس۔`,
    cover_image_url: "/brahui-tarjuma.jpeg",
    cover_alt: "Toba Tek Singh Brahui Translation Cover",
    writer_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    writer: SEED_WRITERS[0],
    original_title: "ٹوبہ ٹیک سنگھ (Toba Tek Singh)",
    original_text: `تقسیم کے دو تین سال بعد پاکستان اور ہندوستان کی حکومتوں کو خیال آیا کہ اخلاقی قیدیوں کی طرح پاگلوں کا بھی تبادلہ ہونا چاہیے۔ یعنی جو ہندو اور سکھ پاگل پاکستان کے پاگل خانوں میں ہیں، انہیں ہندوستان پہنچا دیا جائے اور جو مسلمان ہندوستان کے پاگل خانوں میں ہیں، انہیں پاکستان کے حوالے کر دیا جائے۔

لاہور کے پاگل خانے میں جب یہ خبر پہنچی تو بڑی دلچسپ بحثیں شروع ہوئیں۔ ایک سکھ پاگل تھا جس کا نام بشن سنگھ تھا۔ پندرہ برس سے وہ اس پاگل خانے میں تھا۔ دن رات میں وہ کبھی نہیں سویا تھا۔ نہ لیٹا تھا۔ کبھی کبھار دیوار کے ساتھ ٹیک لگا لیتا تھا۔ اس کی زبان پر ہمیشہ یہ الفاظ رہتے تھے: "اوپڑی گڑگڑ دی اناکس دی بے دھیانا دی منگ دی دال آف دی لالٹین"۔

جب تبادلے کا وقت آیا اور بشن سنگھ کو واہگہ بارڈر پر لایا گیا، تو اس نے افسر سے پوچھا: "ٹوبہ ٹیک سنگھ کہاں ہے؟ پاکستان میں یا ہندوستان میں؟" افسر ہنسا اور بولا: "ہندوستان میں۔"

بشن سنگھ نے انکار کر دیا اور پیچھے بھاگا۔ سپاہیوں نے اسے پکڑنے کی کوشش کی لیکن وہ دونوں ملکوں کی خاردار تاروں کے درمیان کی زمین پر گر پڑا۔ سورج نکلنے سے پہلے اس کے حلق سے چیخ نکلی۔ ادھر خاردار تاروں کے پیچھے ہندوستان تھا، ادھر ویسے ہی تاروں کے پیچھے پاکستان، اور درمیان میں زمین کے اس ٹکڑے پر جس کا کوئی نام نہ تھا، ٹوبہ ٹیک سنگھ پڑا تھا۔`,
    original_lang: "ur",
    original_dir: "rtl",
    source_credit: "Original Urdu Masterpiece (1955), Saadat Hasan Manto",
    translator_name: "عبدالرزاق ساسولی",
    pdf_url: null,
    meta_description: "سعادت حسن منٹو نا شاہکار کسّہ ٹوبہ ٹیک سنگھ نا براہوئی مٹ و بدل۔ براہوئی زبان نا ادبی پوریا۔",
    status: "published",
    published_at: "2024-03-15T10:00:00Z",
    created_at: "2024-03-15T09:00:00Z",
    updated_at: "2024-03-15T10:00:00Z",
  },
  {
    id: "art-2",
    title: "آزادی نا سُہب",
    subtitle: "فیض احمد فیض نا شاہکار نظم 'صبحِ آزادی' نا منظوم براہوئی مٹ",
    slug: "azadi-na-sohb",
    category: "poetry",
    body: `دا چٹ داغ دار رژنائی، دا شب گزیدہ سُہب
دا او سُہب اف کہ ہرانا تمنا ٹی ننا قافلہ روان مسس

ننا سنگت آک پاریرہ کہ دا کسر نا گڈسر آ
روشنائی نا اسہ پین ساہت اس ودی مروئی ءِ
فلک نا خن تا خیسنی مٹ مروئی ءِ
ننا بے ساہا ارواہ تے قرار بنوئی ءِ

ولے ننا است نا درد اونواری ءِ
روشنی نا پیاس اونواری ءِ
نجات نا ساہت پین مونا ءِ
بروسہ متو، ننکان پین مزل اس برجاءِ

مونا ہنبو، سنگتو! کہ دا او سحر اف
ہرانا واہمہ ٹی ننا تپوک خنک چارہ ئسر!`,
    cover_image_url: "/brahui-tarjuma.jpeg",
    cover_alt: "Faiz Ahmad Faiz Poetry Brahui Translation",
    writer_id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    writer: SEED_WRITERS[1],
    original_title: "صبحِ آزادی (Subh-e-Azadi)",
    original_text: `یہ داغ داغ اُجالا، یہ شب گزیدہ سحر
وہ انتظار تھا جس کا، یہ وہ سحر تو نہیں

یہ وہ سحر تو نہیں جس کی آرزو لے کر
چلے تھے یار کہ مل جائے گی کہیں نہ کہیں
فلک کے دشت میں تاروں کی آخری منزل
کہیں تو ہوگا شبِ سست موج کا ساحل
کہیں تو جا کے رکے گا سفینۂ غمِ دل

جواں لہو کی پر اسرار شاہراہوں سے
چلے جو یار تو دامن پہ کتنے ہاتھ پڑے
دیارِ حسن کی بے صبر خوابگاہوں سے
پکارتی رہیں باہیں، بدن بلاتے رہے

ابھی گرانیٔ شب میں کمی نہیں آئی
نجاتِ دیدہ و دل کی گھڑی نہیں آئی
چلے چلو کہ وہ منزل ابھی نہیں آئی!`,
    original_lang: "ur",
    original_dir: "rtl",
    source_credit: "Dast-e-Saba (1952), Faiz Ahmad Faiz",
    translator_name: "نور خان مینگل",
    pdf_url: null,
    meta_description: "فیض احمد فیض نا شاہکار نظم صبح آزادی نا براہوئی زبان ٹی منظوم مٹ و بدل۔",
    status: "published",
    published_at: "2024-03-20T14:30:00Z",
    created_at: "2024-03-20T12:00:00Z",
    updated_at: "2024-03-20T14:30:00Z",
  },
  {
    id: "art-3",
    title: "جہانی ادب و مٹ و بدل نا کڑد",
    subtitle: "خورخے لوئیس بورخیس نا ترجمہ و ادب آ فکر انگیز کالم",
    slug: "world-literature-and-translation",
    category: "articles",
    body: `اسہ کتاب اس ہروخت تینا اولیکو زبان نا قید آن پاش مروک اسہ جہانی پند اس کٹنگ نا کوشست کریکہ۔ مٹ و بدل (ترجمہ) ہچ وختی اسہ بے جان نقل اس مفک، بلکن او تخلیقی ارواہ نا پین ارواہ اسے ٹی داخل مننگ نا نامدار کسر ءِ۔

ہر زبان کائنات ءِ ہرنگ نا تینا اسہ جتا خن اس تخک۔ ہراتم نن انگریزی یا ہسپانوی نا کسّہ سے براہوئی نا لبز اتے ٹی مٹ کینہ، تو نن بیرہ الفاظ آتے بدل تفنہ، بلکن نن اسہ نوکیں تہذیبی پل اس جوڑ کینہ۔ دا پل جہان نا گڑتی، مہر، درد و فکر ءِ ننا چاگڑد نا نیام آ اتیک۔

بورخیس نا ہیت ئس کہ اصل متن نا پابندی آن گیشتر ترجمہ نا اندرونی صداقت اہمیت تخک۔ اسہ جوانیں ترجمہ اس تینا وجود ٹی خود اسہ پین ادبی معجزہ اس جوڑ مریک۔ براہوئی زبان ٹی جہانی ادب نا ترجمہ دا کڑد نا نشاندہی کریک کہ ننا لبزاک ہم جہانی معیار تا کڑد ءِ پاش کننگ نا پبی کچ تخارہ۔`,
    cover_image_url: "/brahui-tarjuma.jpeg",
    cover_alt: "Jorge Luis Borges Essay Brahui Translation",
    writer_id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
    writer: SEED_WRITERS[2],
    original_title: "The Homeric Versions (Las versiones homéricas)",
    original_text: `No problem is as completely concordant with literature and its modest mystery as the questions posed by translation. To suppose that every recombination of elements is necessarily inferior to its original form is to suppose that draft nine is necessarily inferior to draft H -- for there can only be drafts. The concept of the definitive text corresponds only to religion or exhaustion.

A translation is not a copy; it is a continuation of the life of a work into another linguistic and cultural atmosphere. Through translation, languages cross-pollinate, expand their horizons, and enrich the collective human consciousness.`,
    original_lang: "en",
    original_dir: "ltr",
    source_credit: "Selected Non-Fictions, Jorge Luis Borges",
    translator_name: "ڈاکٹر خدائیداد بزدار",
    pdf_url: null,
    meta_description: "بورخیس نا لٹریچر و ترجمہ نا فلسفہ آ فکر انگیز کالم نا براہوئی مٹ۔",
    status: "published",
    published_at: "2024-04-01T08:00:00Z",
    created_at: "2024-04-01T07:30:00Z",
    updated_at: "2024-04-01T08:00:00Z",
  },
  {
    id: "art-4",
    title: "پیرین بندغ و سمندر",
    subtitle: "ارنسٹ ہیمنگوے نا نوبل انعام یافتہ ناول نا براہوئی مٹ",
    slug: "the-old-man-and-the-sea",
    category: "fiction",
    body: `او اسہ پیرین بندغ ئس، ہرادے گلف اسٹریم ٹی تینا سکیف (چنکو کشتی) ٹی ایلو بندغ تیتون بیرہ چودئی ڈہہ مسوسس۔ چوراسی دے مسس کہ او اسہ ماہی اس ہم ہلنگ کتوئس۔ اولیکو چالیس دے تا نیام ٹی اسہ چنا اس اونا سنگت ئس۔ ولے چالیس دے آن پد چنا نا باوہ پیرہ اودے پارے کہ پیرین بندغ چٹ "سالائو" مسنے، یعنی بدقسمت ترین کچ آ ہنانے۔

پیرین بندغ نا خنک چٹ سمندر نا وڑ نیلہ ئسر و بے کچ پرامید ئسر۔ اونا است ٹی ہچ وختی ناامیدی نا جاگہ متو۔ چوراسی ئمی دے اونا باوہ پارے کہ پگہ او پین جہل آ سمندر نا کنڈ ہنور۔

دا ناول انسان نا ہمت، بے وس مسکینی، و ساہدار تا فطرت تون جنگ نا اسہ بے مٹ قصہ اسے، ہرادے براہوئی نا لبز آتیٹی گچین وڑٹ نذر کننگانے۔`,
    cover_image_url: "/brahui-tarjuma.jpeg",
    cover_alt: "The Old Man and the Sea Brahui Translation Cover",
    writer_id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
    writer: SEED_WRITERS[3],
    original_title: "The Old Man and the Sea",
    original_text: `He was an old man who fished alone in a skiff in the Gulf Stream and he had gone eighty-four days now without taking a fish. In the first forty days a boy had been with him. But after forty days without a fish the boy's parents had told him that the old man was now definitely and finally salao, which is the worst form of unlucky.

Everything about him was old except his eyes and they were the same color as the sea and were cheerful and undefeated. "Santiago," the boy said to him as they climbed the bank from where the skiff was hauled up. "I could go with you again. We've made some money." The old man was thin and gaunt with deep wrinkles in the back of his neck.`,
    original_lang: "en",
    original_dir: "ltr",
    source_credit: "The Old Man and the Sea (1952), Ernest Hemingway",
    translator_name: "میر گل خان نصیر سنگت اکیڈمی",
    pdf_url: "/sample-novel.pdf",
    meta_description: "ارنسٹ ہیمنگوے نا نوبل انعام کٹوک ناول دی اولڈ مین اینڈ دی سی نا براہوئی ترجمہ۔",
    status: "published",
    published_at: "2024-04-10T11:15:00Z",
    created_at: "2024-04-10T09:00:00Z",
    updated_at: "2024-04-10T11:15:00Z",
    chapters: [
      {
        id: "chap-1",
        article_id: "art-4",
        chapter_number: 1,
        title: "اولیکو بہر: سمندر نا پند و چوراسی دے",
        body: `او اسہ پیرین بندغ ئس، ہرادے گلف اسٹریم ٹی تینا چنکو کشتی ٹی تنیا شکار کریسہ چوراسی دے مسوسس، ولے اسہ ماہی اس ہم اونا دُو آ بکتوئس۔ 

چنا اودے پارے کہ ننا قسمت خراب ءِ، ولے پیرین بندغ پارے: "قسمت اسہ دے بدل مریک، ای پگہ سمندر نا سبقی کنڈ آ گیشتر مونا کانہ، ہنداڑے کہ ماہی تا ٹولی بریک۔" پیرین بندغ نا دُو تیٹی پرانی رسی تا نشانک ئسر، ولے اونا است ہر وخت تازہ ئس۔`,
      },
      {
        id: "chap-2",
        article_id: "art-4",
        chapter_number: 2,
        title: "ارٹمیکو بہر: مارلن ماہی نا جنگ",
        body: `پنجاسی ئمی دے نا سُہب ئس۔ پیرین بندغ تینا ڈور ءِ سمندر نا اندر پین جہل آ بٹیسس۔ یکدم اودے محسوس مس کہ اسہ بھلو وزندار ماہی اس اونا کانٹا ٹی سرفانے۔

کشتی روان مس۔ ماہی پیرین بندغ نا کشتی ءِ تینا ردٹ گلف اسٹریم نا سمندر ٹی اوار کشیسہ مونا ہنا۔ پیرین بندغ پارے: "ای نے دوست داروہ، ولے ای نے دا دے کشوہ۔ انسان سڑیک، ولے شکست ہچ وختی تفک۔"`,
      },
    ],
  },
];

export const STATIC_PAGES_SEED: Record<string, StaticPageData> = {
  about: {
    id: "about",
    title: "About Brahui Tarjuma (براہوئی ترجمہ)",
    body: `Brahui Tarjuma (براہوئی ترجمہ) is a specialized digital repository and publishing platform founded to enrich the Brahui language with translations of world literature, philosophical essays, classical and modern poetry, and literary criticism.

Written in the time-honored Nastaliq calligraphic tradition, our digital archive provides open, free access to Brahui speakers, students, researchers, and book lovers around the globe.

Every translation is carefully curated, reviewed, and published with full attribution to the original author, original work, and the translator who contributed the labor of love.

Our commitment is to celebrate the depth and beauty of Brahui vocabulary while bridging linguistic borders.`,
  },
  contact: {
    id: "contact",
    title: "Contact & Translation Submissions (رابطہ)",
    body: `Are you a translator working in Brahui? Do you have an unpublished translation of a story, poem, essay, or novel?

We welcome submissions from translators, poets, and scholars who wish to share their work with our reading community.

How to submit:
1. Provide the complete Brahui translation (in Urdu/Arabic Nastaliq script).
2. Include the original title, original author name, and source citation.
3. Include translator details (name, short bio).

Contact email: editor@brahuitarjuma.org
Office / Hub: Quetta, Balochistan.`,
  },
};
