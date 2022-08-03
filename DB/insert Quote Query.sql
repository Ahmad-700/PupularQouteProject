use PopularQuotes;

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
99784541, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Ahmad'),/*username (Account.ID)*/
'date in future',/*message*/
'test',/*author*/
'9999-01-29'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date,writtenDate)
VALUES (
49087129, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'أمير العشاق'),/*username (Account.ID)*/
'يا ليل طول شويه ع الصحبة الحلوة ديه',/*message*/
'واحد مصري',/*author*/
FROM_UNIXTIME(0.001 * 1642712400000),/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
FROM_UNIXTIME(0.001 * 1642780752466)
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date,writtenDate)
VALUES (
76365361, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'أمير العشاق'),/*username (Account.ID)*/
'يا رب العباد وفق الاتحاد',/*message*/
'.',/*author*/
FROM_UNIXTIME(0.001 * 1642712400000),/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
FROM_UNIXTIME(0.001 * 1642781080888)
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date,writtenDate)
VALUES (
56941195, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mohsen'),/*username (Account.ID)*/
'When it''s clear ..... it''s clear',/*message*/
'Mohsen',/*author*/
FROM_UNIXTIME(0.001 * 1642626000000),/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
FROM_UNIXTIME(0.001 * 1642701918917)
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date,writtenDate)
VALUES (
50141088, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'أمير العشاق'),/*username (Account.ID)*/
'إتي يا اتحاد يا بو دم خفيف لونه اصفر ماله وصيف',/*message*/
'صالح القرني',/*author*/
FROM_UNIXTIME(0.001 * 1642626000000),/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
FROM_UNIXTIME(0.001 * 1642696040870)
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date,writtenDate)
VALUES (
1889283, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'أمير العشاق'),/*username (Account.ID)*/
'ادم الصلاة على الحبيب محمد فقبولها حتما بودن ترددي أعمالنا بين القبول وردها إلا الصلاة على الحبيب محمد',/*message*/
'واحد صوفي',/*author*/
FROM_UNIXTIME(0.001 * 1642626000000),/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
FROM_UNIXTIME(0.001 * 1642696132793)
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date,writtenDate)
VALUES (
49100016, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'أمير العشاق'),/*username (Account.ID)*/
'في الهوا يلقي في اهله المهجر اه يا بونمي طعمك تغير',/*message*/
'واحد صوفي',/*author*/
FROM_UNIXTIME(0.001 * 1642453200000),/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
FROM_UNIXTIME(0.001 * 1642519801897)
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date,writtenDate)
VALUES (
65676224, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'العربي'),/*username (Account.ID)*/
'اول مثل بحساب اسمه عربي',/*message*/
'العربي',/*author*/
FROM_UNIXTIME(0.001 * 1577836800000),/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
FROM_UNIXTIME(0.001 * 1642515594307)
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
467465, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. Unknown'),/*username (Account.ID)*/
'I''ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.',/*message*/
'Maya Angelou',/*author*/
'2005-01-28'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
165489, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. UnKnown'),/*username (Account.ID)*/
'If you look at what you have in life, you''ll always have more. If you look at what you don''t have in life, you''ll never have enough.',/*message*/
'Oprah Winfrey',/*author*/
'2002-06-25'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
684984, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. UnKnown'),/*username (Account.ID)*/
'If you set your goals ridiculously high and it''s a failure, you will fail above everyone else''s success.',/*message*/
'James Cameron',/*author*/
'2001-09-16'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
5198748, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. UnKnown'),/*username (Account.ID)*/
'The way to get started is to quit talking and begin doing.',/*message*/
'Walt Disney',/*author*/
'1996-06-23'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
6548884, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. UnKnown'),/*username (Account.ID)*/
'Your time is limited, so don''t waste it living someone else''s life. Don''t be trapped by dogma – which is living with the results of other people''s thinking.',/*message*/
'Steve Jobs',/*author*/
'1992-11-13'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
6484657, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. UnKnown'),/*username (Account.ID)*/
'If you tell the truth, you don''t have to remember anything.',/*message*/
'Mark Twain',/*author*/
'1985-08-01'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
314143, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. UnKnown'),/*username (Account.ID)*/
'Two things are infinite: the universe and human stupidity; and I''m not sure about the universe.',/*message*/
'Albert Einstein',/*author*/
'1968-04-19'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
345234, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. UnKnown'),/*username (Account.ID)*/
'Make it as simple as possible, but not simpler.',/*message*/
'Albert Einstein',/*author*/
'1965-06-03'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
1111587, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'a'),/*username (Account.ID)*/
'AAAAAAAaaaaaaaaaaa',/*message*/
'test',/*author*/
'1965-06-03'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
18987, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'a'),/*username (Account.ID)*/
'ZZZZZZZZZzzzzzzz',/*message*/
'test',/*author*/
'1965-06-03'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
6484655, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. Unknown'),/*username (Account.ID)*/
'Life is what happens when you''re busy making other plans.',/*message*/
'John Lennon',/*author*/
'1965-06-03'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
16877674, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'a'),/*username (Account.ID)*/
'likes',/*message*/
'test',/*author*/
'1965-06-03'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
113548720, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'a'),/*username (Account.ID)*/
'likes negative',/*message*/
'test',/*author*/
'1965-06-03'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
13543472, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. Unknown'),/*username (Account.ID)*/
'So many books, so little time.',/*message*/
'Frank Zappa',/*author*/
'1912-09-12'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
234523, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. Unknown'),/*username (Account.ID)*/
'Be the change that you wish to see in the world.',/*message*/
'Mahatma Gandhi',/*author*/
'1909-11-20'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
675564, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. Unknown'),/*username (Account.ID)*/
'Live as if you were to die tomorrow. Learn as if you were to live forever.',/*message*/
'Mahatma Gandhi',/*author*/
'1902-07-13'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
4684215, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Mr. Unknown'),/*username (Account.ID)*/
'If life were predictable it would cease to be life, and be without flavor.',/*message*/
'Eleanor Roosevelt',/*author*/
'1852-04-06'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
35687852, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'a'),/*username (Account.ID)*/
'date old',/*message*/
'test',/*author*/
'0001-02-24'/*FROM_UNIXTIME(0.001 * 1643112714748)date in milliseconds*/
);

