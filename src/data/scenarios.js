// ============================================================
//  SVĚDECTVÍ SCÉNÁŘE — Cesta do Ráje
//  Terminologie: NWT, jw.org
//
//  Tokeny které hra nahradí skutečnými jmény hráčů:
//    {currentPlayer}  — hráč který je na tahu (svědek)
//    {targetPlayer}   — náhodně vybraný druhý hráč (hraje druhého člověka)
//
//  Každý scénář má:
//    id              — unikátní identifikátor
//    title           — název scénáře
//    category        — typ situace
//    difficulty      — "easy" / "medium" / "hard"
//    setting         — kde se scéna odehrává
//    situation       — popis situace (bez jmen — obecný)
//    roleA           — popis role svědka ({currentPlayer})
//    roleB           — popis role druhého hráče ({targetPlayer})
//    objection       — konkrétní námitka nebo otázka kterou {targetPlayer} říká
//    goal            — co má {currentPlayer} říct/dokázat aby "uspěl"
//    hint            — nápověda pro svědka (biblický verš nebo tip)
//    timeSeconds     — čas na scénář
//    successCriteria — jak skupina hlasuje o úspěchu
// ============================================================

export const WITNESSING_SCENARIOS = [

  // ─────────────────────────────────────────────
  //  KATEGORIE: SLUŽBA U DVEŘÍ
  // ─────────────────────────────────────────────

  {
    id: "DVERE_ZANEPRAZDNENA",
    title: "Zaneprázdněná maminka",
    category: "služba u dveří",
    difficulty: "easy",
    setting: "Obytný dům, dopoledne v úterý",
    situation:
      "Dveře otevírá unavená maminka s miminkem na ruce. Je jasně vidět, že má plné ruce práce. Není nepřátelská — jen zaneprázdněná.",
    roleA: "Jsi svědek Jehovův na ranní službě. Máš tablet s jw.org a Bibli.",
    roleB:
      "Hraješ unavenou maminku ({targetPlayer}). Jsi vstřícná ale nemáš čas. Řekni: 'Promiňte, já teď opravdu nemám čas, malý brečí.'",
    objection: "Promiňte, já teď opravdu nemám čas, malý brečí.",
    goal: "Laskavě nabídni jednu konkrétní naději z Bible (např. Zjevení 21:4 — žádné slzy) a zanech kontakt nebo pozvání na jw.org. Nenutit, neblokovat.",
    hint: "Zjevení 21:4 — 'utře jim každou slzu z očí.' Krátké, srdečné, konkrétní.",
    timeSeconds: 120,
    successCriteria:
      "Skupina hlasuje — byl/a {currentPlayer} laskavý/á? Nabídl/a konkrétní naději? Respektoval/a čas maminky?",
  },

  {
    id: "DVERE_SKEPTIK",
    title: "Skeptický důchodce",
    category: "služba u dveří",
    difficulty: "medium",
    setting: "Rodinný dům, odpoledne",
    situation:
      "Dveře otevírá starší pán okolo 70 let. Byl v minulosti věřící, ale ztratil víru po smrti manželky. Je hořký a skeptický.",
    roleA:
      "Jsi zkušený svědek. Cítíš, že tento člověk prožil bolest. Přistupuješ s empatií.",
    roleB:
      "Hraješ důchodce ({targetPlayer}). Jsi hořký a smutný. Řekni: 'Víra? Já věřil celý život a Bůh mi vzal ženu. Kde byl váš Bůh tehdy?'",
    objection:
      "Víra? Já věřil celý život a Bůh mi vzal ženu. Kde byl váš Bůh tehdy?",
    goal: "Nepřít se o teologii. Uznat bolest. Ukázat Jehovovu soucitnost a naději na vzkříšení (Jan 5:28–29). Nabídnout studium.",
    hint: "Jan 11:35 — 'Ježíš zaplakal.' Jehova chápe bolest. Skutky 24:15 — naděje na vzkříšení.",
    timeSeconds: 180,
    successCriteria:
      "Skupina hlasuje — projevil/a {currentPlayer} empatii? Nabídl/a naději na vzkříšení? Nepřel/a se?",
  },

  {
    id: "DVERE_JINEVIRA",
    title: "Věřící jiné církve",
    category: "služba u dveří",
    difficulty: "medium",
    setting: "Panelový dům, sobotní ráno",
    situation:
      "Dveře otevírá slušně oblečená žena s křížkem na krku. Je to praktikující katolička, chodí každou neděli do kostela. Je vstřícná ale hrdá na svou víru.",
    roleA: "Jsi na službě s partnerem. Vedeš rozhovor.",
    roleB:
      "Hraješ katoličku ({targetPlayer}). Jsi milá ale pevná. Řekni: 'Já jsem věřící, chodím do kostela. Vy jste ti svědkové, že? My máme svou víru, děkuji.'",
    objection:
      "Já jsem věřící, chodím do kostela. Vy jste ti svědkové, že? My máme svou víru, děkuji.",
    goal: "Najít společnou základnu — víra v Boha, Bible. Položit jednu otevřenou otázku která povzbudí přemýšlení (např. o Božím jménu nebo o naději). Nenabádat, neosoudit.",
    hint: "Kolosanům 4:6 — mluvit 'vždy s milostí, jako by bylo ochuceno solí.' Zkus: 'Skvělé! Mohu se zeptat — znáte osobní jméno Boha?'",
    timeSeconds: 180,
    successCriteria:
      "Skupina hlasuje — byl/a {currentPlayer} respektující? Položil/a dobrou otázku? Nechal/a prostor pro odpověď?",
  },

  {
    id: "DVERE_AGRESIVNI",
    title: "Agresivní muž",
    category: "služba u dveří",
    difficulty: "hard",
    setting: "Rodinný dům, víkendové ráno",
    situation:
      "Dveře otevírá naštvaný muž. Zjevně ho vzbudili ze spaní. Je hlasitý a pohrdlivý.",
    roleA: "Jsi klidný/á a laskavý/á. Víš jak reagovat na odpor.",
    roleB:
      "Hraješ naštvaného muže ({targetPlayer}). Jsi hlasitý a pohrdlivý. Řekni: 'Zase vy! Kolikrát vám mám říct ať mě nechají na pokoji! Tohle je obtěžování!'",
    objection:
      "Zase vy! Kolikrát vám mám říct ať mě nechají na pokoji! Tohle je obtěžování!",
    goal: "Klidně se omluvit, nezůstat dlouho, nenechat se vyprovokovat. Eventuálně zanechat jeden krátký výrok a odejít s důstojností.",
    hint: "2. Timoteovi 2:24 — 'Jehovův otrok nemá bojovat, ale být mírný ke všem.' Jednoduše: 'Omlouváme se za rušení. Přeji vám hezký den.' A odejít.",
    timeSeconds: 90,
    successCriteria:
      "Skupina hlasuje — zachoval/a {currentPlayer} klid? Nepolemizoval/a? Odešel/odešla s důstojností?",
  },

  {
    id: "DVERE_MLADEZ",
    title: "Zvídavý teenager",
    category: "služba u dveří",
    difficulty: "easy",
    setting: "Byt v panelovém domě, odpoledne po škole",
    situation:
      "Dveře otevírá teenager okolo 16 let. Rodiče nejsou doma. Je zvídavý a upřímný — nikdy se svědky nemluvil.",
    roleA: "Jsi mladý/á svědek, přibližně stejného věku. Mluvíš přirozeně.",
    roleB:
      "Hraješ teenagera ({targetPlayer}). Jsi zvídavý/á. Řekni: 'Ahoj. Co vlastně vy svědkové věříte? Nikdy jsem s vámi nemluvil.'",
    objection: "Ahoj. Co vlastně vy svědkové věříte? Nikdy jsem s vámi nemluvil.",
    goal: "Přirozeně vysvětlit jedno klíčové téma — Boží jméno, naděje ráje nebo Boží království. Nabídnout jw.org nebo brožuru pro mládež.",
    hint: "Jan 17:3 — věčný život = poznání Jehovy. Buď přirozený/á — teenager cítí autentičnost.",
    timeSeconds: 150,
    successCriteria:
      "Skupina hlasuje — mluvil/a {currentPlayer} přirozeně? Vysvětlil/a jasně jedno téma? Nabídl/a další zdroj?",
  },

  // ─────────────────────────────────────────────
  //  KATEGORIE: NEFORMÁLNÍ SVĚDECTVÍ
  // ─────────────────────────────────────────────

  {
    id: "NEFORMALNI_PRACE",
    title: "Kolega v práci — otázka o smyslu života",
    category: "neformální svědectví",
    difficulty: "easy",
    setting: "Přestávka na oběd v kantýně",
    situation:
      "Sedíte spolu na obědě. Kolega je viditelně sklíčený — právě se dozvěděl o nemoci v rodině. Sám otevírá téma.",
    roleA: "Jsi Jehovův svědek v práci. Kolegu znáš, máte přátelský vztah.",
    roleB:
      "Hraješ kolegu ({targetPlayer}). Jsi sklíčený. Řekni: '{currentPlayer}, řekni mi upřímně — ty věříš v Boha. Proč dovolí tolik utrpení? Mé matce diagnostikovali rakovinu.'",
    objection:
      "Řekni mi upřímně — ty věříš v Boha. Proč dovolí tolik utrpení? Mé matce diagnostikovali rakovinu.",
    goal: "Nejdříve projevit empatii a soucit. Pak nabídnout biblickou perspektivu — Jehova utrpení nezpůsobil, ale slibuje konec utrpení (Zjevení 21:4). Nenabádat k okamžitému studiu — jen zasít semínko.",
    hint: "Nejdřív srdce, pak Bible. Řekni: 'To je těžké, moc mi to líto.' A pak: 'Smím ti říct co mně osobně v takových chvílích pomáhá?'",
    timeSeconds: 150,
    successCriteria:
      "Skupina hlasuje — projevil/a {currentPlayer} empatii jako první? Nabídl/a naději přirozeně? Nepůsobil/a jako leták?",
  },

  {
    id: "NEFORMALNI_SKOLA",
    title: "Spolužák ve škole — výsměch",
    category: "neformální svědectví",
    difficulty: "medium",
    setting: "Přestávka na chodbě školy",
    situation:
      "Spolužák tě před ostatními zesměšňuje kvůli tomu, že jsi svědek Jehovův. Ostatní se přihlížejí.",
    roleA:
      "Jsi student, svědek Jehovův. Jsi klidný/á a sebejistý/á — vychovaný/á k respektu a zároveň k odhodlání.",
    roleB:
      "Hraješ spolužáka ({targetPlayer}). Jsi sarkastický. Řekni nahlas: 'Hele lidi, {currentPlayer} nevěří v evoluci a nechodí na narozeniny! Co to je za blázny ti vaši svědkové?'",
    objection:
      "Hele lidi, nevěří v evoluci a nechodí na narozeniny! Co to je za blázny ti svědkové?",
    goal: "Klidně a sebejistě odpovědět bez hněvu. Vysvětlit jeden důvod proč věříš — ne obranou ale s jistotou. Příklad: 'Máš pravdu, jsem jiný. A jsem za to rád.'",
    hint: "1. Petra 3:15 — 'buďte vždy připraveni dát obhajobu.' Neboj se být jiný — to je síla, ne slabost.",
    timeSeconds: 120,
    successCriteria:
      "Skupina hlasuje — byl/a {currentPlayer} klidný/á? Odpověděl/a sebejistě bez hněvu? Řekl/a aspoň jeden pozitivní důvod své víry?",
  },

  {
    id: "NEFORMALNI_RODINA",
    title: "Příbuzný na rodinném obědě",
    category: "neformální svědectví",
    difficulty: "medium",
    setting: "Rodinný oběd u prarodičů",
    situation:
      "Strýc který není svědek otevírá téma u stolu. Je zvídavý ale provokativní — chce tě dostat do úzkých před celou rodinou.",
    roleA: "Jsi mladý svědek. Rodinu miluješ a chceš zachovat dobré vztahy.",
    roleB:
      "Hraješ strýce ({targetPlayer}). Jsi provokativní. Řekni: 'No {currentPlayer}, tak proč si zase nepřijde na Vánoce? Co si vlastně myslíte, že jste lepší než ostatní?'",
    objection:
      "Proč si zase nepřijdeš na Vánoce? Co si vlastně myslíte, že jste lepší než ostatní?",
    goal: "Vysvětlit laskavě a bez obrany proč jako JW Vánoce neslavíme — ne nadřazenost, ale přesvědčení. Zachovat rodinnou atmosféru.",
    hint: "Přísloví 15:1 — 'Měkká odpověď odvrací rozhořčení.' Řekni: 'Vůbec si nemyslíme, že jsme lepší. Jen se snažíme řídit tím, co čteme v Bibli. Smím ti říct proč?'",
    timeSeconds: 180,
    successCriteria:
      "Skupina hlasuje — zachoval/a {currentPlayer} klid a laskavost? Vysvětlil/a bez nadřazenosti? Udržel/a rodinnou atmosféru?",
  },

  {
    id: "NEFORMALNI_INTERNET",
    title: "Online diskuze — anonymní útok",
    category: "neformální svědectví",
    difficulty: "hard",
    setting: "Sociální síť nebo online fórum",
    situation:
      "V online diskuzi tě někdo napadá s tvrdými argumenty proti svědkům Jehovovým. Je agresivní a cituje zkreslené informace.",
    roleA:
      "Jsi svědek Jehovův a rozhoduješ se zda a jak odpovědět online.",
    roleB:
      "Hraješ anonymního útočníka ({targetPlayer}). Jsi agresivní. Řekni: 'Svědkové Jehovovi jsou sekta! Zakazují transfuze a lidé umírají! Jak můžeš věřit takové organizaci?'",
    objection:
      "Svědkové Jehovovi jsou sekta! Zakazují transfuze a lidé umírají! Jak můžeš věřit takové organizaci?",
    goal: "Klidně a věcně odpovědět na otázku krve — biblická základna (Skutky 15:28–29), osobní přesvědčení. Nehádat se donekonečna. Nabídnout jw.org pro přesné informace.",
    hint: "Skutky 15:28–29 — zdrž se krve. Odpověz jednou jasně, nabídni zdroj. Pak přestaň — Přísloví 26:4.",
    timeSeconds: 150,
    successCriteria:
      "Skupina hlasuje — odpověděl/a {currentPlayer} věcně bez agrese? Citoval/a Bibli? Věděl/a kdy přestat?",
  },

  // ─────────────────────────────────────────────
  //  KATEGORIE: BIBLICKÉ STUDIUM
  // ─────────────────────────────────────────────

  {
    id: "STUDIUM_PRVNI",
    title: "První biblické studium",
    category: "biblické studium",
    difficulty: "easy",
    setting: "Obývací pokoj zájemce o Bibli",
    situation:
      "Zájemce souhlasil s prvním biblickým studiem. Je nervózní a neví co čekat. Nikdy předtím nečetl Bibli systematicky.",
    roleA:
      "Jsi zkušený svědek. Začínáš první studium — chceš aby zájemce byl příjemně překvapen.",
    roleB:
      "Hraješ zájemce ({targetPlayer}). Jsi nervózní a zvídavý. Řekni: 'Tak jak to vlastně funguje? Musím se učit zpaměti? A kolik to trvá?'",
    objection:
      "Tak jak to vlastně funguje? Musím se učit zpaměti? A kolik to trvá?",
    goal: "Přirozeně vysvětlit jak biblické studium funguje — uvolněná atmosféra, otázky a odpovědi, žádné memorování. Ukázat publikaci Čemu nás vlastně učí Bible? a otevřít ji na první lekci.",
    hint: "Buď přirozený/á a přátelský/á. Zdůrazni: 'Studujeme spolu, není to zkouška.' Matouš 11:29 — Ježíš je mírný a pokorný srdcem.",
    timeSeconds: 180,
    successCriteria:
      "Skupina hlasuje — byl/a {currentPlayer} přirozený/á a přátelský/á? Vysvětlil/a jasně jak studium funguje? Použil/a publikaci?",
  },

  {
    id: "STUDIUM_TROJICE",
    title: "Otázka o Trojici",
    category: "biblické studium",
    difficulty: "hard",
    setting: "Třetí biblické studium u zájemce doma",
    situation:
      "Zájemce byl celý život křesťan a věří v Trojici. Po třetím studiu poprvé zpochybňuje co se naučil. Je zmatený ale otevřený.",
    roleA: "Jsi svědek vedoucí studium. Přistupuješ s trpělivostí a respektem.",
    roleB:
      "Hraješ zájemce ({targetPlayer}). Jsi zmatený. Řekni: 'Ale počkejte — já jsem celý život věřil v Trojici. Otec, Syn a Duch svatý — tři osoby, jeden Bůh. To přeci v Bibli je, ne?'",
    objection:
      "Já jsem celý život věřil v Trojici. Otec, Syn a Duch svatý — tři osoby, jeden Bůh. To přeci v Bibli je, ne?",
    goal: "Laskavě ukázat Jan 14:28 ('Otec je větší než já'), Jan 17:3, Marek 12:29. Vysvětlit, že slovo Trojice v Bibli není. Neútočit na jeho dosavadní víru — respektovat cestu.",
    hint: "Trpělivost! Římanům 2:4 — Jehovova laskavost vede k pokání. Dej mu čas přemýšlet. Nemusíš vyhrát diskuzi dnes.",
    timeSeconds: 210,
    successCriteria:
      "Skupina hlasuje — byl/a {currentPlayer} trpělivý/á? Použil/a konkrétní verše? Respektoval/a pocity zájemce?",
  },

  {
    id: "STUDIUM_KREV",
    title: "Otázka o krvi",
    category: "biblické studium",
    difficulty: "hard",
    setting: "Páté biblické studium — témata etiky",
    situation:
      "Zájemce je lékař nebo zdravotní sestra. Je pozitivně nakloněn studiu, ale téma krve ho znepokojuje.",
    roleA: "Jsi svědek vedoucí studium. Znáš biblické základy tématu.",
    roleB:
      "Hraješ lékaře/zdravotní sestru ({targetPlayer}). Jsi věcný/á. Řekni: 'Promiňte, ale tohle nemohu přijmout. Jako lékař/zdravotní sestra vím, že krevní transfuze zachraňuje životy. Jak může Bůh zakazovat něco co zachraňuje lidi?'",
    objection:
      "Jako lékař vím, že krevní transfuze zachraňuje životy. Jak může Bůh zakazovat něco co zachraňuje lidi?",
    goal: "Věcně vysvětlit — Skutky 15:28–29, 1. Mojžíšova 9:4. Zmínit alternativní léčbu bez krve. Ukázat, že jde o osobní přesvědčení z respektu k Jehovovu nařízení, ne o sebevraždu.",
    hint: "Nepřít se lékařsky — to není tvé pole. Drž se biblické základny a respektu k Jehovovu pohledu na krev jako na posvátnou. Zdůrazni osobní svobodu svědomí.",
    timeSeconds: 210,
    successCriteria:
      "Skupina hlasuje — citoval/a {currentPlayer} správné verše? Byl/a věcný/á bez agrese? Zmínil/a alternativy?",
  },

  // ─────────────────────────────────────────────
  //  KATEGORIE: VOZÍČKOVÁ SLUŽBA
  // ─────────────────────────────────────────────

  {
    id: "VOZICEK_ZVIDA",
    title: "Zvídavý kolemjdoucí u vozíku",
    category: "vozíčková služba",
    difficulty: "easy",
    setting: "Nákupní centrum, vozíčkový stolek",
    situation:
      "Člověk se zastaví u vozíku z vlastní iniciativy. Je zvídavý — nikdy se s JW nebavil.",
    roleA:
      "Jsi za vozíkem — usmíváš se, jsi přístupný/á. Tabletí máš otevřené jw.org.",
    roleB:
      "Hraješ kolemjdoucího ({targetPlayer}). Jsi zvídavý. Řekni: 'Promiňte, já jsem tu reklamu na jw.org viděl už mockrát. Co to vlastně je? O čem mluvíte?'",
    objection: "Já jsem tu reklamu na jw.org viděl už mockrát. Co to vlastně je?",
    goal: "Přirozeně a přátelsky vysvětlit co jw.org nabízí. Ukázat jeden konkrétní obsah na tabletu. Nabídnout publikaci nebo pozvat na studium.",
    hint: "Buď konkrétní — ukaž na tabletu odpověď na jednu otázku která by ho mohla zajímat. Například: 'Máte nějakou otázku o Bibli nebo o životě?'",
    timeSeconds: 120,
    successCriteria:
      "Skupina hlasuje — byl/a {currentPlayer} přátelský/á? Ukázal/a konkrétní obsah? Nabídl/a další kontakt?",
  },

  {
    id: "VOZICEK_KRITIK",
    title: "Kritik organizace u vozíku",
    category: "vozíčková služba",
    difficulty: "hard",
    setting: "Pěší zóna ve městě, vozíčkový stolek",
    situation:
      "Člověk se zastaví záměrně aby svědky konfrontoval. Má připravené argumenty z internetu.",
    roleA:
      "Jsi za vozíkem. Jsi klidný/á — víš, že někteří lidé přicházejí konfrontovat.",
    roleB:
      "Hraješ kritika ({targetPlayer}). Jsi agresivní. Řekni: 'Vy jste ta organizace co rozbíjí rodiny! Mám kamaráda jehož rodina se kvůli vám rozpadla. To je vaše láska?'",
    objection:
      "Vy jste ta organizace co rozbíjí rodiny! Mám kamaráda jehož rodina se kvůli vám rozpadla. To je vaše láska?",
    goal: "Klidně uznat bolest situace bez přiznání viny za organizaci. Vysvětlit biblický princip jednoty rodiny. Nenechat se vtáhnout do polemiky. Ukázat 1. Korinťanům 13 — láska.",
    hint: "Nejdřív: 'To zní bolestivě a mrzí mě to.' Pak: 'Bible je jasná — rodina je posvátná.' Neobhajovat konkrétní případy. Být lidský/á.",
    timeSeconds: 150,
    successCriteria:
      "Skupina hlasuje — zachoval/a {currentPlayer} klid? Uznal/a bolest? Nepolemizoval/a o konkrétním případu?",
  },

  // ─────────────────────────────────────────────
  //  KATEGORIE: POVZBUZENÍ VE SBORU
  // ─────────────────────────────────────────────

  {
    id: "SBOR_POVZBUZENI",
    title: "Bratr/sestra prochází těžkostmi",
    category: "povzbuzení ve sboru",
    difficulty: "easy",
    setting: "Po shromáždění, v Království síni",
    situation:
      "Všiml/a sis, že bratr nebo sestra vypadá sklíčeně. Víš, že v poslední době prochází těžkostmi v práci.",
    roleA:
      "Jsi člen sboru. Chceš povzbudit — přirozeně, ne formálně.",
    roleB:
      "Hraješ sklíčeného bratra/sestru ({targetPlayer}). Jsi unavený/á. Řekni: 'Ahoj {currentPlayer}. Jo, jde to nějak. Práce je teď náročná a já nevím jak dál.'",
    objection:
      "Jo, jde to nějak. Práce je teď náročná a já nevím jak dál.",
    goal: "Naslouchat. Nabídnout konkrétní povzbuzení z Bible. Eventuálně nabídnout praktickou pomoc nebo modlitbu. Nezůstat jen u frází.",
    hint: "Římanům 15:1 — nosit slabosti druhých. Galatským 6:2 — nést břemena jedni druhých. Neptej se 'jak to jde?' — to je fráze. Ptej se konkrétně.",
    timeSeconds: 120,
    successCriteria:
      "Skupina hlasuje — naslouchal/a {currentPlayer} opravdově? Nabídl/a konkrétní povzbuzení nebo pomoc? Nekončilo to frázemi?",
  },

  {
    id: "SBOR_NOVY_CLEN",
    title: "Nový člen sboru — uvítání",
    category: "povzbuzení ve sboru",
    difficulty: "easy",
    setting: "Po shromáždění, první návštěva nového bratra",
    situation:
      "Do sboru přišel nový bratr nebo sestra. Stojí sám/sama a vypadá nejistě.",
    roleA:
      "Jsi člen sboru. Přistupuješ s upřímným zájmem — ne jen formálně.",
    roleB:
      "Hraješ nového člena sboru ({targetPlayer}). Jsi nejistý/á. Řekni: 'Ahoj. Jsem tu nový/á... přestěhoval/a jsem se minulý měsíc. Ještě moc nikoho neznám.'",
    objection:
      "Ahoj. Jsem tu nový/á... přestěhoval/a jsem se minulý měsíc. Ještě moc nikoho neznám.",
    goal: "Upřímně se představit. Projevit skutečný zájem — odkud, co dělá, jak se mu/jí líbí sbor. Nabídnout konkrétní pomoc s orientací v novém místě.",
    hint: "Římanům 15:7 — 'přijímejte jeden druhého.' Hebrejům 13:2 — pohostinnost. Konkrétní pozvání je lepší než obecné 'zavolej kdykoli'.",
    timeSeconds: 120,
    successCriteria:
      "Skupina hlasuje — byl/a {currentPlayer} upřímný/á? Projevil/a konkrétní zájem? Nabídl/a konkrétní pomoc nebo pozvání?",
  },

  {
    id: "SBOR_ODPADLIK",
    title: "Kamarád který přestal chodit na shromáždění",
    category: "povzbuzení ve sboru",
    difficulty: "hard",
    setting: "Setkání na ulici nebo v kavárně",
    situation:
      "Náhodně potkáš kamaráda ze sboru, který přestal chodit na shromáždění. Není vyloučený — jen duchovně ochladl. Je mu nepříjemně.",
    roleA: "Jsi upřímný/á a starostlivý/á — ne soudíš, ale miluješ.",
    roleB:
      "Hraješ kamaráda ({targetPlayer}). Je ti nepříjemně. Řekni: 'Hele {currentPlayer}... já vím. Prostě jsem potřeboval pauzu. Moc věcí se mi hromadí a nějak jsem na shromáždění chodil jen z povinnosti.'",
    objection:
      "Prostě jsem potřeboval pauzu. Nějak jsem na shromáždění chodil jen z povinnosti.",
    goal: "Naslouchat bez odsuzování. Podělit se o vlastní zkušenost jak překonáváš duchovní únavu. Nenabádat do sboru silou — zasít semínko lásky.",
    hint: "Hebrejům 12:12 — 'posilněte unavené ruce.' Juda 23 — 'zachraňte jedny vytáhnutím z ohně.' Buď přítel/kyně — ne misionář/ka.",
    timeSeconds: 180,
    successCriteria:
      "Skupina hlasuje — naslouchal/a {currentPlayer} bez odsuzování? Sdílel/a osobní zkušenost? Zachoval/a přátelský tón?",
  },

  // ─────────────────────────────────────────────
  //  KATEGORIE: SPECIÁLNÍ SITUACE
  // ─────────────────────────────────────────────

  {
    id: "SPECIAL_SMRT",
    title: "Truchlící soused po ztrátě blízkého",
    category: "speciální situace",
    difficulty: "medium",
    setting: "Na chodbě bytového domu",
    situation:
      "Sousedka — která není svědkem — právě pohřbila manžela. Vidíš ji plakat na chodbě.",
    roleA: "Jsi svědek Jehovův. Znáš ji jen povrchně.",
    roleB:
      "Hraješ sousedku ({targetPlayer}). Jsi zdrcená. Řekni: 'Promiňte... já jen... 40 let spolu a teď... nevím co mám dělat.'",
    objection: "40 let spolu a teď... nevím co mám dělat.",
    goal: "Být přítomný/á — ne hned kázat. Nabídnout praktickou pomoc. Eventuálně laskavě zmínit naději na vzkříšení pokud je otevřena.",
    hint: "Jan 11:35 — Ježíš zaplakal. Římanům 12:15 — 'plakejte s těmi kdo pláčou.' Přítomnost a soucit jsou více než slova. Naděje přijde ve správnou chvíli.",
    timeSeconds: 150,
    successCriteria:
      "Skupina hlasuje — byl/a {currentPlayer} přítomný/á a soucitný/á? Neuspěchal/a kazatelství? Nabídl/a praktickou pomoc?",
  },

  {
    id: "SPECIAL_VEZEN",
    title: "Svědectví za mřížemi",
    category: "speciální situace",
    difficulty: "hard",
    setting: "Věznice — svědkové jsou v zemi kde je jejich víra zakázána",
    situation:
      "Jsi vězněn/a pro svoji víru. Spoluvězeň se ptá proč jsi tu — a proč věříš i přesto.",
    roleA:
      "Jsi Jehovův svědek ve vězení pro víru. Jsi klidný/á — Jehova ti dává sílu.",
    roleB:
      "Hraješ spoluvězně ({targetPlayer}). Jsi zvídavý. Řekni: 'Takže ty jsi tady kvůli náboženství? Fakt nevěříš žádné vládě? Nestojí to za to — proč to děláš?'",
    objection: "Nestojí to za to — proč to děláš?",
    goal: "Svědčit o Jehovovi z osobního přesvědčení — ne dogmaticky ale ze srdce. Ukázat proč je Jehovova autorita nadřazená lidské. Sdílet naději.",
    hint: "Skutky 5:29 — 'musíme poslouchat Boha jako vládce.' Filipanům 1:12–14 — uvěznění Pavla posunulo evangelium. Tvoje situace může být svědectvím.",
    timeSeconds: 180,
    successCriteria:
      "Skupina hlasuje — svědčil/a {currentPlayer} ze srdce? Vysvětlil/a proč Jehovova autorita nad lidskou? Působil/a přesvědčivě?",
  },

  {
    id: "SPECIAL_LEKARSKA",
    title: "Lékař o krevní transfuzi",
    category: "speciální situace",
    difficulty: "hard",
    setting: "Nemocnice — rozhovor s lékařem",
    situation:
      "Jsi v nemocnici a lékař tě naléhavě přesvědčuje k přijetí krevní transfuze. Jsi v klidném stavu — není to akutní krize.",
    roleA:
      "Jsi Jehovův svědek. Máš u sebe pokročilou lékařskou směrnici. Jsi klidný/á ale pevný/á.",
    roleB:
      "Hraješ lékaře ({targetPlayer}). Jsi naléhavý. Řekni: 'Poslouchejte — bez transfuze riskujete život. Já respektuji vaši víru, ale jako lékař musím říct: tohle je vážné. Prosím přehodnoťte to.'",
    objection:
      "Bez transfuze riskujete život. Jako lékař musím říct: tohle je vážné. Prosím přehodnoťte to.",
    goal: "Klidně ale pevně vysvětlit své rozhodnutí. Odkázat na pokročilou lékařskou směrnici. Požádat o alternativní léčbu bez krve. Zachovat respekt k lékaři.",
    hint: "Skutky 15:28–29. Zmínit konkrétní alternativy (erythropoetin, rekombinantní faktory). Být klidný/á — panika by podkopala tvoje svědectví.",
    timeSeconds: 180,
    successCriteria:
      "Skupina hlasuje — byl/a {currentPlayer} klidný/á a pevný/á? Citoval/a biblický základ? Zmínil/a alternativy a směrnici?",
  },

];

// ─────────────────────────────────────────────
//  POMOCNÉ FUNKCE
// ─────────────────────────────────────────────

export const getRandomScenario = () => {
  return WITNESSING_SCENARIOS[
    Math.floor(Math.random() * WITNESSING_SCENARIOS.length)
  ];
};

export const getScenariosByDifficulty = (difficulty) =>
  WITNESSING_SCENARIOS.filter((s) => s.difficulty === difficulty);

export const getScenariosByCategory = (category) =>
  WITNESSING_SCENARIOS.filter((s) => s.category === category);

// Nahradí tokeny {currentPlayer} a {targetPlayer} skutečnými jmény
export const fillScenarioNames = (scenario, currentPlayerName, targetPlayerName) => {
  const replace = (text) =>
    text
      .replace(/\{currentPlayer\}/g, currentPlayerName)
      .replace(/\{targetPlayer\}/g, targetPlayerName);

  return {
    ...scenario,
    situation:        replace(scenario.situation),
    roleA:            replace(scenario.roleA),
    roleB:            replace(scenario.roleB),
    objection:        replace(scenario.objection),
    goal:             replace(scenario.goal),
    successCriteria:  replace(scenario.successCriteria),
  };
};

export const SCENARIO_CATEGORIES = [
  "služba u dveří",
  "neformální svědectví",
  "biblické studium",
  "vozíčková služba",
  "povzbuzení ve sboru",
  "speciální situace",
];
