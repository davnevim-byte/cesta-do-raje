// ============================================================
//  SVĚDECTVÍ SCÉNÁŘE — Cesta do Ráje
//  Rozdělení:
//    DOORS_SCENARIOS   — pro políčko Dveře (vnější kruh) — lehčí
//    SERVICE_SCENARIOS — pro políčko Služba (vnitřní kruh) — těžší
//    CONGREGATION_SCENARIOS — pro políčko Sbor (vnitřní kruh)
// ============================================================

// ─────────────────────────────────────────────
//  DVEŘE — lehčí scénáře (vnější kruh)
//  Kategorie: služba u dveří, vozíčková, neformální (easy/medium)
// ─────────────────────────────────────────────

export const DOORS_SCENARIOS = [

  {
    id: "DVERE_ZANEPRAZDNENA",
    title: "Zaneprázdněná maminka",
    category: "služba u dveří",
    difficulty: "easy",
    setting: "Obytný dům, dopoledne v úterý",
    situation: "Dveře otevírá unavená maminka s miminkem na ruce. Je jasně vidět, že má plné ruce práce. Není nepřátelská — jen zaneprázdněná.",
    roleA: "Jsi svědek Jehovův na ranní službě. Máš tablet s jw.org a Bibli.",
    roleB: "Hraješ unavenou maminku ({targetPlayer}). Jsi vstřícná ale nemáš čas. Řekni: 'Promiňte, já teď opravdu nemám čas, malý brečí.'",
    objection: "Promiňte, já teď opravdu nemám čas, malý brečí.",
    goal: "Laskavě nabídni jednu konkrétní naději z Bible (např. Zjevení 21:4) a zanech kontakt nebo pozvání na jw.org. Nenutit, neblokovat.",
    hint: "Zjevení 21:4 — 'utře jim každou slzu z očí.' Krátké, srdečné, konkrétní.",
    timeSeconds: 120,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} laskavý/á? Nabídl/a konkrétní naději? Respektoval/a čas maminky?",
  },

  {
    id: "DVERE_MLADEZ",
    title: "Zvídavý teenager",
    category: "služba u dveří",
    difficulty: "easy",
    setting: "Byt v panelovém domě, odpoledne po škole",
    situation: "Dveře otevírá teenager okolo 16 let. Rodiče nejsou doma. Je zvídavý a upřímný — nikdy se svědky nemluvil.",
    roleA: "Jsi mladý/á svědek, přibližně stejného věku. Mluvíš přirozeně.",
    roleB: "Hraješ teenagera ({targetPlayer}). Jsi zvídavý/á. Řekni: 'Ahoj. Co vlastně vy svědkové věříte? Nikdy jsem s vámi nemluvil.'",
    objection: "Ahoj. Co vlastně vy svědkové věříte? Nikdy jsem s vámi nemluvil.",
    goal: "Přirozeně vysvětlit jedno klíčové téma — Boží jméno, naděje ráje nebo Boží království. Nabídnout jw.org nebo brožuru pro mládež.",
    hint: "Jan 17:3 — věčný život = poznání Jehovy. Buď přirozený/á — teenager cítí autentičnost.",
    timeSeconds: 150,
    successCriteria: "Skupina hlasuje — mluvil/a {currentPlayer} přirozeně? Vysvětlil/a jasně jedno téma? Nabídl/a další zdroj?",
  },

  {
    id: "DVERE_SOUSED",
    title: "Přátelský soused",
    category: "služba u dveří",
    difficulty: "easy",
    setting: "Rodinný dům v předměstí, sobotní dopoledne",
    situation: "Dveře otevírá sympatický muž středního věku. Zná tě z viděné ze sousedství. Je přátelský a zvídavý.",
    roleA: "Jsi na sobotní službě. Znáš ho od pohledu — potkáváte se na ulici.",
    roleB: "Hraješ souseda ({targetPlayer}). Jsi přátelský. Řekni: 'Aha, vy chodíte tu do ulice! Já vás vídám. Co vlastně děláte — rozdáváte letáky nebo co?'",
    objection: "Vy chodíte tu do ulice! Co vlastně děláte — rozdáváte letáky nebo co?",
    goal: "Přirozeně vysvětlit co je kazatelská služba. Nabídnout publikaci nebo jw.org. Zanechat dobrý dojem souseda.",
    hint: "Buď přirozený/á a přátelský/á. Řekni mu co Bibli říká o naději pro celou zemi — Žalm 37:29.",
    timeSeconds: 120,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} přirozený/á? Vysvětlil/a účel návštěvy? Nabídl/a konkrétní materiál?",
  },

  {
    id: "VOZICEK_ZVIDA",
    title: "Zvídavý kolemjdoucí u vozíku",
    category: "vozíčková služba",
    difficulty: "easy",
    setting: "Nákupní centrum, vozíčkový stolek",
    situation: "Člověk se zastaví u vozíku z vlastní iniciativy. Je zvídavý — nikdy se s JW nebavil.",
    roleA: "Jsi za vozíkem — usmíváš se, jsi přístupný/á. Na tabletu máš otevřené jw.org.",
    roleB: "Hraješ kolemjdoucího ({targetPlayer}). Jsi zvídavý. Řekni: 'Promiňte, já jsem tu reklamu na jw.org viděl už mockrát. Co to vlastně je? O čem mluvíte?'",
    objection: "Já jsem tu reklamu na jw.org viděl už mockrát. Co to vlastně je?",
    goal: "Přirozeně a přátelsky vysvětlit co jw.org nabízí. Ukázat jeden konkrétní obsah na tabletu. Nabídnout publikaci nebo pozvat na studium.",
    hint: "Buď konkrétní — ukaž na tabletu odpověď na jednu otázku. Například: 'Máte nějakou otázku o Bibli nebo o životě?'",
    timeSeconds: 120,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} přátelský/á? Ukázal/a konkrétní obsah? Nabídl/a další kontakt?",
  },

  {
    id: "NEFORMALNI_PRACE",
    title: "Kolega v práci — otázka o smyslu života",
    category: "neformální svědectví",
    difficulty: "easy",
    setting: "Přestávka na oběd v kantýně",
    situation: "Sedíte spolu na obědě. Kolega je viditelně sklíčený — právě se dozvěděl o nemoci v rodině. Sám otevírá téma.",
    roleA: "Jsi Jehovův svědek v práci. Kolegu znáš, máte přátelský vztah.",
    roleB: "Hraješ kolegu ({targetPlayer}). Jsi sklíčený. Řekni: '{currentPlayer}, řekni mi upřímně — ty věříš v Boha. Proč dovolí tolik utrpení? Mé matce diagnostikovali rakovinu.'",
    objection: "Řekni mi upřímně — ty věříš v Boha. Proč dovolí tolik utrpení? Mé matce diagnostikovali rakovinu.",
    goal: "Nejdříve projevit empatii a soucit. Pak nabídnout biblickou perspektivu — Jehova utrpení nezpůsobil, ale slibuje konec utrpení (Zjevení 21:4).",
    hint: "Nejdřív srdce, pak Bible. Řekni: 'To je těžké, moc mi to líto.' A pak: 'Smím ti říct co mně osobně v takových chvílích pomáhá?'",
    timeSeconds: 150,
    successCriteria: "Skupina hlasuje — projevil/a {currentPlayer} empatii jako první? Nabídl/a naději přirozeně? Nepůsobil/a jako leták?",
  },

  {
    id: "NEFORMALNI_SKOLA",
    title: "Spolužák ve škole — výsměch",
    category: "neformální svědectví",
    difficulty: "medium",
    setting: "Přestávka na chodbě školy",
    situation: "Spolužák tě před ostatními zesměšňuje kvůli tomu, že jsi svědek Jehovův. Ostatní se přihlížejí.",
    roleA: "Jsi student, svědek Jehovův. Jsi klidný/á a sebejistý/á.",
    roleB: "Hraješ spolužáka ({targetPlayer}). Jsi sarkastický. Řekni nahlas: 'Hele lidi, {currentPlayer} nevěří v evoluci a nechodí na narozeniny! Co to je za blázny ti vaši svědkové?'",
    objection: "Hele lidi, nevěří v evoluci a nechodí na narozeniny! Co to je za blázny ti svědkové?",
    goal: "Klidně a sebejistě odpovědět bez hněvu. Vysvětlit jeden důvod proč věříš — ne obranou ale s jistotou.",
    hint: "1. Petra 3:15 — 'buďte vždy připraveni dát obhajobu.' Neboj se být jiný — to je síla, ne slabost.",
    timeSeconds: 120,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} klidný/á? Odpověděl/a sebejistě bez hněvu? Řekl/a aspoň jeden pozitivní důvod své víry?",
  },

  {
    id: "NEFORMALNI_RODINA",
    title: "Příbuzný na rodinném obědě",
    category: "neformální svědectví",
    difficulty: "medium",
    setting: "Rodinný oběd u prarodičů",
    situation: "Strýc který není svědek otevírá téma u stolu. Je zvídavý ale provokativní.",
    roleA: "Jsi mladý svědek. Rodinu miluješ a chceš zachovat dobré vztahy.",
    roleB: "Hraješ strýce ({targetPlayer}). Jsi provokativní. Řekni: 'No {currentPlayer}, tak proč si zase nepřijde na Vánoce? Co si vlastně myslíte, že jste lepší než ostatní?'",
    objection: "Proč si zase nepřijdeš na Vánoce? Co si vlastně myslíte, že jste lepší než ostatní?",
    goal: "Vysvětlit laskavě proč jako JW Vánoce neslavíme — ne nadřazenost, ale přesvědčení. Zachovat rodinnou atmosféru.",
    hint: "Přísloví 15:1 — 'Měkká odpověď odvrací rozhořčení.' Řekni: 'Vůbec si nemyslíme, že jsme lepší. Jen se snažíme řídit tím, co čteme v Bibli.'",
    timeSeconds: 180,
    successCriteria: "Skupina hlasuje — zachoval/a {currentPlayer} klid a laskavost? Vysvětlil/a bez nadřazenosti? Udržel/a rodinnou atmosféru?",
  },

];

// ─────────────────────────────────────────────
//  SLUŽBA — těžší scénáře (vnitřní kruh)
//  Kategorie: těžší dveře, biblické studium, speciální situace, vozíčková
// ─────────────────────────────────────────────

export const SERVICE_SCENARIOS = [

  {
    id: "DVERE_SKEPTIK",
    title: "Skeptický důchodce",
    category: "služba u dveří",
    difficulty: "medium",
    setting: "Rodinný dům, odpoledne",
    situation: "Dveře otevírá starší pán okolo 70 let. Byl v minulosti věřící, ale ztratil víru po smrti manželky. Je hořký a skeptický.",
    roleA: "Jsi zkušený svědek. Cítíš, že tento člověk prožil bolest. Přistupuješ s empatií.",
    roleB: "Hraješ důchodce ({targetPlayer}). Jsi hořký a smutný. Řekni: 'Víra? Já věřil celý život a Bůh mi vzal ženu. Kde byl váš Bůh tehdy?'",
    objection: "Víra? Já věřil celý život a Bůh mi vzal ženu. Kde byl váš Bůh tehdy?",
    goal: "Nepřít se o teologii. Uznat bolest. Ukázat Jehovovu soucitnost a naději na vzkříšení (Jan 5:28–29). Nabídnout studium.",
    hint: "Jan 11:35 — 'Ježíš zaplakal.' Jehova chápe bolest. Skutky 24:15 — naděje na vzkříšení.",
    timeSeconds: 180,
    successCriteria: "Skupina hlasuje — projevil/a {currentPlayer} empatii? Nabídl/a naději na vzkříšení? Nepřel/a se?",
  },

  {
    id: "DVERE_JINEVIRA",
    title: "Věřící jiné církve",
    category: "služba u dveří",
    difficulty: "medium",
    setting: "Panelový dům, sobotní ráno",
    situation: "Dveře otevírá slušně oblečená žena s křížkem na krku. Je to praktikující katolička. Je vstřícná ale hrdá na svou víru.",
    roleA: "Jsi na službě s partnerem. Vedeš rozhovor.",
    roleB: "Hraješ katoličku ({targetPlayer}). Jsi milá ale pevná. Řekni: 'Já jsem věřící, chodím do kostela. Vy jste ti svědkové, že? My máme svou víru, děkuji.'",
    objection: "Já jsem věřící, chodím do kostela. Vy jste ti svědkové, že? My máme svou víru, děkuji.",
    goal: "Najít společnou základnu — víra v Boha, Bible. Položit jednu otevřenou otázku o Božím jménu nebo naději.",
    hint: "Kolosanům 4:6 — mluvit 'vždy s milostí.' Zkus: 'Skvělé! Mohu se zeptat — znáte osobní jméno Boha?'",
    timeSeconds: 180,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} respektující? Položil/a dobrou otázku? Nechal/a prostor pro odpověď?",
  },

  {
    id: "DVERE_AGRESIVNI",
    title: "Agresivní muž",
    category: "služba u dveří",
    difficulty: "hard",
    setting: "Rodinný dům, víkendové ráno",
    situation: "Dveře otevírá naštvaný muž. Zjevně ho vzbudili ze spaní. Je hlasitý a pohrdlivý.",
    roleA: "Jsi klidný/á a laskavý/á. Víš jak reagovat na odpor.",
    roleB: "Hraješ naštvaného muže ({targetPlayer}). Jsi hlasitý. Řekni: 'Zase vy! Kolikrát vám mám říct ať mě nechají na pokoji! Tohle je obtěžování!'",
    objection: "Zase vy! Kolikrát vám mám říct ať mě nechají na pokoji! Tohle je obtěžování!",
    goal: "Klidně se omluvit, nezůstat dlouho, nenechat se vyprovokovat. Zanechat jeden krátký výrok a odejít s důstojností.",
    hint: "2. Timoteovi 2:24 — 'Jehovův otrok nemá bojovat, ale být mírný.' Jednoduše: 'Omlouváme se za rušení. Přeji vám hezký den.' A odejít.",
    timeSeconds: 90,
    successCriteria: "Skupina hlasuje — zachoval/a {currentPlayer} klid? Nepolemizoval/a? Odešel/odešla s důstojností?",
  },

  {
    id: "STUDIUM_PRVNI",
    title: "První biblické studium",
    category: "biblické studium",
    difficulty: "easy",
    setting: "Obývací pokoj zájemce o Bibli",
    situation: "Zájemce souhlasil s prvním biblickým studiem. Je nervózní a neví co čekat. Nikdy předtím nečetl Bibli systematicky.",
    roleA: "Jsi zkušený svědek. Začínáš první studium — chceš aby zájemce byl příjemně překvapen.",
    roleB: "Hraješ zájemce ({targetPlayer}). Jsi nervózní. Řekni: 'Tak jak to vlastně funguje? Musím se učit zpaměti? A kolik to trvá?'",
    objection: "Tak jak to vlastně funguje? Musím se učit zpaměti? A kolik to trvá?",
    goal: "Přirozeně vysvětlit jak biblické studium funguje — uvolněná atmosféra, otázky a odpovědi, žádné memorování. Ukázat publikaci Čemu nás vlastně učí Bible?",
    hint: "Buď přirozený/á. Zdůrazni: 'Studujeme spolu, není to zkouška.' Matouš 11:29 — Ježíš je mírný srdcem.",
    timeSeconds: 180,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} přirozený/á? Vysvětlil/a jasně jak studium funguje? Použil/a publikaci?",
  },

  {
    id: "STUDIUM_TROJICE",
    title: "Otázka o Trojici",
    category: "biblické studium",
    difficulty: "hard",
    setting: "Třetí biblické studium u zájemce doma",
    situation: "Zájemce byl celý život křesťan a věří v Trojici. Po třetím studiu poprvé zpochybňuje co se naučil. Je zmatený ale otevřený.",
    roleA: "Jsi svědek vedoucí studium. Přistupuješ s trpělivostí a respektem.",
    roleB: "Hraješ zájemce ({targetPlayer}). Jsi zmatený. Řekni: 'Ale počkejte — já jsem celý život věřil v Trojici. Otec, Syn a Duch svatý — tři osoby, jeden Bůh. To přeci v Bibli je, ne?'",
    objection: "Já jsem celý život věřil v Trojici. Otec, Syn a Duch svatý — tři osoby, jeden Bůh. To přeci v Bibli je, ne?",
    goal: "Laskavě ukázat Jan 14:28, Jan 17:3, Marek 12:29. Vysvětlit, že slovo Trojice v Bibli není. Respektovat cestu zájemce.",
    hint: "Trpělivost! Římanům 2:4 — Jehovova laskavost vede k pokání. Dej mu čas přemýšlet.",
    timeSeconds: 210,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} trpělivý/á? Použil/a konkrétní verše? Respektoval/a pocity zájemce?",
  },

  {
    id: "STUDIUM_KREV",
    title: "Otázka o krvi",
    category: "biblické studium",
    difficulty: "hard",
    setting: "Páté biblické studium — témata etiky",
    situation: "Zájemce je lékař nebo zdravotní sestra. Je pozitivně nakloněn studiu, ale téma krve ho znepokojuje.",
    roleA: "Jsi svědek vedoucí studium. Znáš biblické základy tématu.",
    roleB: "Hraješ lékaře ({targetPlayer}). Jsi věcný/á. Řekni: 'Promiňte, ale tohle nemohu přijmout. Jako lékař vím, že krevní transfuze zachraňuje životy. Jak může Bůh zakazovat něco co zachraňuje lidi?'",
    objection: "Jako lékař vím, že krevní transfuze zachraňuje životy. Jak může Bůh zakazovat něco co zachraňuje lidi?",
    goal: "Věcně vysvětlit Skutky 15:28–29, 1. Mojžíšova 9:4. Zmínit alternativní léčbu bez krve.",
    hint: "Nepřít se lékařsky. Drž se biblické základny a zdůrazni osobní svobodu svědomí.",
    timeSeconds: 210,
    successCriteria: "Skupina hlasuje — citoval/a {currentPlayer} správné verše? Byl/a věcný/á bez agrese? Zmínil/a alternativy?",
  },

  {
    id: "VOZICEK_KRITIK",
    title: "Kritik organizace u vozíku",
    category: "vozíčková služba",
    difficulty: "hard",
    setting: "Pěší zóna ve městě, vozíčkový stolek",
    situation: "Člověk se zastaví záměrně aby svědky konfrontoval. Má připravené argumenty z internetu.",
    roleA: "Jsi za vozíkem. Jsi klidný/á — víš, že někteří lidé přicházejí konfrontovat.",
    roleB: "Hraješ kritika ({targetPlayer}). Jsi agresivní. Řekni: 'Vy jste ta organizace co rozbíjí rodiny! Mám kamaráda jehož rodina se kvůli vám rozpadla. To je vaše láska?'",
    objection: "Vy jste ta organizace co rozbíjí rodiny! Mám kamaráda jehož rodina se kvůli vám rozpadla. To je vaše láska?",
    goal: "Klidně uznat bolest situace bez přiznání viny za organizaci. Vysvětlit biblický princip jednoty rodiny.",
    hint: "Nejdřív: 'To zní bolestivě a mrzí mě to.' Pak: 'Bible je jasná — rodina je posvátná.' Neobhajovat konkrétní případy.",
    timeSeconds: 150,
    successCriteria: "Skupina hlasuje — zachoval/a {currentPlayer} klid? Uznal/a bolest? Nepolemizoval/a o konkrétním případu?",
  },

  {
    id: "NEFORMALNI_INTERNET",
    title: "Online diskuze — anonymní útok",
    category: "neformální svědectví",
    difficulty: "hard",
    setting: "Sociální síť nebo online fórum",
    situation: "V online diskuzi tě někdo napadá s tvrdými argumenty proti svědkům Jehovovým. Je agresivní a cituje zkreslené informace.",
    roleA: "Jsi svědek Jehovův a rozhoduješ se zda a jak odpovědět online.",
    roleB: "Hraješ anonymního útočníka ({targetPlayer}). Jsi agresivní. Řekni: 'Svědkové Jehovovi jsou sekta! Zakazují transfuze a lidé umírají! Jak můžeš věřit takové organizaci?'",
    objection: "Svědkové Jehovovi jsou sekta! Zakazují transfuze a lidé umírají! Jak můžeš věřit takové organizaci?",
    goal: "Klidně a věcně odpovědět na otázku krve — biblická základna (Skutky 15:28–29). Nehádat se donekonečna. Nabídnout jw.org.",
    hint: "Skutky 15:28–29. Odpověz jednou jasně, nabídni zdroj. Pak přestaň — Přísloví 26:4.",
    timeSeconds: 150,
    successCriteria: "Skupina hlasuje — odpověděl/a {currentPlayer} věcně bez agrese? Citoval/a Bibli? Věděl/a kdy přestat?",
  },

  {
    id: "SPECIAL_SMRT",
    title: "Truchlící soused po ztrátě blízkého",
    category: "speciální situace",
    difficulty: "medium",
    setting: "Na chodbě bytového domu",
    situation: "Sousedka — která není svědkem — právě pohřbila manžela. Vidíš ji plakat na chodbě.",
    roleA: "Jsi svědek Jehovův. Znáš ji jen povrchně.",
    roleB: "Hraješ sousedku ({targetPlayer}). Jsi zdrcená. Řekni: 'Promiňte... já jen... 40 let spolu a teď... nevím co mám dělat.'",
    objection: "40 let spolu a teď... nevím co mám dělat.",
    goal: "Být přítomný/á — ne hned kázat. Nabídnout praktickou pomoc. Eventuálně laskavě zmínit naději na vzkříšení.",
    hint: "Jan 11:35 — Ježíš zaplakal. Římanům 12:15 — 'plakejte s těmi kdo pláčou.' Přítomnost a soucit jsou více než slova.",
    timeSeconds: 150,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} přítomný/á a soucitný/á? Neuspěchal/a kazatelství? Nabídl/a praktickou pomoc?",
  },

  {
    id: "SPECIAL_VEZEN",
    title: "Svědectví za mřížemi",
    category: "speciální situace",
    difficulty: "hard",
    setting: "Věznice — svědkové jsou v zemi kde je jejich víra zakázána",
    situation: "Jsi vězněn/a pro svoji víru. Spoluvězeň se ptá proč jsi tu — a proč věříš i přesto.",
    roleA: "Jsi Jehovův svědek ve vězení pro víru. Jsi klidný/á — Jehova ti dává sílu.",
    roleB: "Hraješ spoluvězně ({targetPlayer}). Jsi zvídavý. Řekni: 'Takže ty jsi tady kvůli náboženství? Nestojí to za to — proč to děláš?'",
    objection: "Nestojí to za to — proč to děláš?",
    goal: "Svědčit o Jehovovi z osobního přesvědčení. Ukázat proč je Jehovova autorita nadřazená lidské. Sdílet naději.",
    hint: "Skutky 5:29 — 'musíme poslouchat Boha jako vládce.' Filipanům 1:12–14 — uvěznění Pavla posunulo evangelium.",
    timeSeconds: 180,
    successCriteria: "Skupina hlasuje — svědčil/a {currentPlayer} ze srdce? Vysvětlil/a proč Jehovova autorita nad lidskou? Působil/a přesvědčivě?",
  },

  {
    id: "SPECIAL_LEKARSKA",
    title: "Lékař o krevní transfuzi",
    category: "speciální situace",
    difficulty: "hard",
    setting: "Nemocnice — rozhovor s lékařem",
    situation: "Jsi v nemocnici a lékař tě naléhavě přesvědčuje k přijetí krevní transfuze. Jsi v klidném stavu — není to akutní krize.",
    roleA: "Jsi Jehovův svědek. Máš u sebe pokročilou lékařskou směrnici. Jsi klidný/á ale pevný/á.",
    roleB: "Hraješ lékaře ({targetPlayer}). Jsi naléhavý. Řekni: 'Poslouchejte — bez transfuze riskujete život. Já respektuji vaši víru, ale jako lékař musím říct: tohle je vážné. Prosím přehodnoťte to.'",
    objection: "Bez transfuze riskujete život. Jako lékař musím říct: tohle je vážné. Prosím přehodnoťte to.",
    goal: "Klidně ale pevně vysvětlit své rozhodnutí. Odkázat na pokročilou lékařskou směrnici. Požádat o alternativní léčbu bez krve.",
    hint: "Skutky 15:28–29. Zmínit konkrétní alternativy (erythropoetin, rekombinantní faktory). Být klidný/á — panika by podkopala tvoje svědectví.",
    timeSeconds: 180,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} klidný/á a pevný/á? Citoval/a biblický základ? Zmínil/a alternativy a směrnici?",
  },

];

// ─────────────────────────────────────────────
//  SBOR — scénáře pro sborový život (vnitřní kruh)
// ─────────────────────────────────────────────

export const CONGREGATION_SCENARIOS = [

  // ── Povzbuzení ve sboru ──────────────────────────────────

  {
    id: "SBOR_POVZBUZENI",
    title: "Bratr/sestra prochází těžkostmi",
    category: "povzbuzení ve sboru",
    difficulty: "easy",
    setting: "Po shromáždění, v Království síni",
    situation: "Všiml/a sis, že bratr nebo sestra vypadá sklíčeně. Víš, že v poslední době prochází těžkostmi v práci.",
    roleA: "Jsi člen sboru. Chceš povzbudit — přirozeně, ne formálně.",
    roleB: "Hraješ sklíčeného bratra/sestru ({targetPlayer}). Jsi unavený/á. Řekni: 'Ahoj {currentPlayer}. Jo, jde to nějak. Práce je teď náročná a já nevím jak dál.'",
    objection: "Jo, jde to nějak. Práce je teď náročná a já nevím jak dál.",
    goal: "Naslouchat. Nabídnout konkrétní povzbuzení z Bible. Eventuálně nabídnout praktickou pomoc nebo modlitbu.",
    hint: "Římanům 15:1 — nosit slabosti druhých. Galatským 6:2 — nést břemena jedni druhých. Ptej se konkrétně.",
    timeSeconds: 120,
    successCriteria: "Skupina hlasuje — naslouchal/a {currentPlayer} opravdově? Nabídl/a konkrétní povzbuzení nebo pomoc? Nekončilo to frázemi?",
  },

  {
    id: "SBOR_NOVY_CLEN",
    title: "Nový člen sboru — uvítání",
    category: "povzbuzení ve sboru",
    difficulty: "easy",
    setting: "Po shromáždění, první návštěva nového bratra",
    situation: "Do sboru přišel nový bratr nebo sestra. Stojí sám/sama a vypadá nejistě.",
    roleA: "Jsi člen sboru. Přistupuješ s upřímným zájmem — ne jen formálně.",
    roleB: "Hraješ nového člena sboru ({targetPlayer}). Jsi nejistý/á. Řekni: 'Ahoj. Jsem tu nový/á... přestěhoval/a jsem se minulý měsíc. Ještě moc nikoho neznám.'",
    objection: "Ahoj. Jsem tu nový/á... přestěhoval/a jsem se minulý měsíc. Ještě moc nikoho neznám.",
    goal: "Upřímně se představit. Projevit skutečný zájem — odkud, co dělá, jak se mu/jí líbí sbor. Nabídnout konkrétní pomoc.",
    hint: "Římanům 15:7 — 'přijímejte jeden druhého.' Hebrejům 13:2 — pohostinnost. Konkrétní pozvání je lepší než obecné 'zavolej kdykoli'.",
    timeSeconds: 120,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} upřímný/á? Projevil/a konkrétní zájem? Nabídl/a konkrétní pomoc nebo pozvání?",
  },

  {
    id: "SBOR_ODPADLIK",
    title: "Kamarád který přestal chodit na shromáždění",
    category: "povzbuzení ve sboru",
    difficulty: "hard",
    setting: "Setkání na ulici nebo v kavárně",
    situation: "Náhodně potkáš kamaráda ze sboru, který přestal chodit na shromáždění. Není vyloučený — jen duchovně ochladl.",
    roleA: "Jsi upřímný/á a starostlivý/á — ne soudíš, ale miluješ.",
    roleB: "Hraješ kamaráda ({targetPlayer}). Je ti nepříjemně. Řekni: 'Hele {currentPlayer}... já vím. Prostě jsem potřeboval pauzu. Moc věcí se mi hromadí a nějak jsem na shromáždění chodil jen z povinnosti.'",
    objection: "Prostě jsem potřeboval pauzu. Nějak jsem na shromáždění chodil jen z povinnosti.",
    goal: "Naslouchat bez odsuzování. Podělit se o vlastní zkušenost jak překonáváš duchovní únavu. Zasít semínko lásky.",
    hint: "Hebrejům 12:12 — 'posilněte unavené ruce.' Juda 23 — 'zachraňte jedny vytáhnutím z ohně.' Buď přítel/kyně — ne misionář/ka.",
    timeSeconds: 180,
    successCriteria: "Skupina hlasuje — naslouchal/a {currentPlayer} bez odsuzování? Sdílel/a osobní zkušenost? Zachoval/a přátelský tón?",
  },

  {
    id: "SBOR_NAVSTEVA",
    title: "Návštěva bratra/sestry v těžkosti",
    category: "povzbuzení ve sboru",
    difficulty: "medium",
    setting: "Domov bratra nebo sestry, večer v týdnu",
    situation: "Navštěvuješ bratra nebo sestru který/á prochází zdravotními problémy a nemůže chodit na shromáždění. Cítí se izolovaný/á od sboru.",
    roleA: "Jsi člen sboru. Přišel/přišla jsi z vlastní iniciativy — bez pozvání.",
    roleB: "Hraješ nemocného bratra/sestru ({targetPlayer}). Jsi překvapený/á. Řekni: 'Ó, to jsi ty! Nečekal/a jsem tě... Já si připadám tak odříznutý/á od sboru. Ani nevím co je na shromáždění nového.'",
    objection: "Nečekal/a jsem tě... Já si připadám tak odříznutý/á od sboru. Ani nevím co je na shromáždění nového.",
    goal: "Přinést povzbuzení ze shromáždění — sdílet bod který byl zajímavý. Nabídnout modlitbu. Zjistit co konkrétně potřebuje.",
    hint: "Jakub 1:27 — navštěvovat vdovy a sirotky v jejich soužení. Římanům 12:13 — sdílet s potřebnými. Buď konkrétní v nabídce pomoci.",
    timeSeconds: 150,
    successCriteria: "Skupina hlasuje — přinesl/a {currentPlayer} konkrétní povzbuzení ze shromáždění? Nabídl/a modlitbu? Zjistil/a co potřebuje?",
  },

  // ── Komentáře ke Strážní věži ──────────────────────────

  {
    id: "STRAZNI_VEZ_1",
    title: "Komentář ke Strážní věži — Jehova vidí srdce",
    category: "strážní věž",
    difficulty: "easy",
    setting: "Studium Strážní věže ve sboru",
    situation: "Na studiu Strážní věže zazněl tento odstavec:",
    passage: `„Jehova neposuzuje lidi podle jejich vzhledu ani vnějšího úspěchu. On vidí přímo do srdce. (1. Samuelova 16:7) To nás může velmi povzbudit — bez ohledu na to, jak nás vidí ostatní lidé, Jehova zná naše upřímné úsilí a oceňuje ho.`,
    roleA: "Jsi na shromáždění. Moderátor čte odstavec a ptá se na komentáře.",
    roleB: "Hraješ moderátora ({targetPlayer}). Přečti odstavec a zeptej se: 'Jak nás může tato myšlenka — že Jehova vidí naše srdce — povzbudit v každodenním životě?'",
    objection: "Jak nás může tato myšlenka — že Jehova vidí naše srdce — povzbudit v každodenním životě?",
    goal: "Dát krátký, upřímný komentář vlastními slovy (30–60 sekund). Aplikovat myšlenku na konkrétní situaci ze života.",
    hint: "Komentář není přednáška — je to sdílení. Řekni co tě osobně na tomto odstavci oslovilo.",
    timeSeconds: 90,
    successCriteria: "Skupina hlasuje — byl/a komentář {currentPlayer} upřímný? Aplikoval/a myšlenku konkrétně? Byl/a stručný/á?",
  },

  {
    id: "STRAZNI_VEZ_2",
    title: "Komentář ke Strážní věži — Modlitba v těžkostech",
    category: "strážní věž",
    difficulty: "easy",
    setting: "Studium Strážní věže ve sboru",
    situation: "Na studiu Strážní věže zazněl tento odstavec:",
    passage: `„Když procházíme těžkostmi, Jehova nás zve: 'Přehoď na Jehovu svůj náklad a on tě bude živit.' (Žalm 55:22) Modlitba není jen rituál — je to rozhovor s někým kdo nás skutečně miluje a má moc pomoci. Král David to zažil nesčetněkrát.`,
    roleA: "Jsi na shromáždění. Moderátor čte odstavec a ptá se na komentáře.",
    roleB: "Hraješ moderátora ({targetPlayer}). Přečti odstavec a zeptej se: 'Jak vám osobně modlitba pomohla v těžké situaci?'",
    objection: "Jak vám osobně modlitba pomohla v těžké situaci?",
    goal: "Sdílet upřímný osobní zážitek s modlitbou. Nebo vysvětlit proč je modlitba důležitá vlastními slovy.",
    hint: "Neboj se být osobní — to je síla komentáře. Ostatní budou povzbuzeni tvou upřímností.",
    timeSeconds: 90,
    successCriteria: "Skupina hlasuje — byl/a komentář {currentPlayer} osobní a upřímný? Povzbudil ostatní?",
  },

  {
    id: "STRAZNI_VEZ_3",
    title: "Komentář ke Strážní věži — Odolávat světskému myšlení",
    category: "strážní věž",
    difficulty: "medium",
    setting: "Studium Strážní věže ve sboru",
    situation: "Na studiu Strážní věže zazněl tento odstavec:",
    passage: `„Světské myšlení nás obklopuje ze všech stran — v médiích, v práci, ve škole. Pavel nás varuje: 'Nepřizpůsobujte se tomuto systému věcí.' (Římanům 12:2) Abychom odolali, potřebujeme aktivně pěstovat jehovský způsob myšlení skrze pravidelné studium a modlitbu.`,
    roleA: "Jsi na shromáždění. Moderátor čte odstavec a ptá se na komentáře.",
    roleB: "Hraješ moderátora ({targetPlayer}). Přečti odstavec a zeptej se: 'Jaké konkrétní způsoby nám pomáhají odolávat světskému myšlení?'",
    objection: "Jaké konkrétní způsoby nám pomáhají odolávat světskému myšlení?",
    goal: "Uvést 2–3 konkrétní praktické způsoby jak si udržet jehovský pohled. Propojit s osobní zkušeností.",
    hint: "Filipanům 4:8 — přemýšlet o čestných věcech. Buď konkrétní — 'Osobně mi pomáhá...'",
    timeSeconds: 90,
    successCriteria: "Skupina hlasuje — uvedl/a {currentPlayer} konkrétní způsoby? Byl/a praktický/á? Propojil/a s osobní zkušeností?",
  },

  {
    id: "STRAZNI_VEZ_4",
    title: "Komentář ke Strážní věži — Radost ze služby",
    category: "strážní věž",
    difficulty: "easy",
    setting: "Studium Strážní věže ve sboru",
    situation: "Na studiu Strážní věže zazněl tento odstavec:",
    passage: `„Ježíš řekl, že je šťastnější dávat než přijímat. (Skutky 20:35) Kazatelská služba nám dává příležitost sdílet tu nejcennější věc — naději z Božího slova. Ti, kdo pravidelně slouží, svědčí o tom, že jim to přináší hlubokou radost — i přes odmítnutí a těžkosti.`,
    roleA: "Jsi na shromáždění. Moderátor čte odstavec a ptá se na komentáře.",
    roleB: "Hraješ moderátora ({targetPlayer}). Přečti odstavec a zeptej se: 'Co vám osobně přináší radost v kazatelské službě?'",
    objection: "Co vám osobně přináší radost v kazatelské službě?",
    goal: "Sdílet konkrétní zážitek nebo aspekt služby který ti přináší radost. Povzbudit ostatní.",
    hint: "Buď konkrétní — konkrétní příběh nebo situace ze služby. Obecné fráze méně povzbuzují.",
    timeSeconds: 90,
    successCriteria: "Skupina hlasuje — sdílel/a {currentPlayer} konkrétní zážitek? Byl/a upřímný/á? Povzbudil ostatní?",
  },

  // ── Sborové aktivity ────────────────────────────────────

  {
    id: "SBOR_SVEDECTVI_Z_POLE",
    title: "Svědectví z pole",
    category: "sborový život",
    difficulty: "easy",
    setting: "Sdílení po shromáždění nebo na setkání skupiny",
    situation: "Přišla řada na tebe — sdílej zážitek ze služby který tě povzbudil nebo poučil. Ostatní naslouchají.",
    roleA: "Jsi na tahu. Sdílíš zážitek ze své kazatelské služby — může být nedávný nebo starší.",
    roleB: "Hraješ moderátora skupiny ({targetPlayer}). Řekni: '{currentPlayer}, sdílej prosím s námi zážitek ze služby — třeba i krátký — který tě nějak oslovil nebo poučil.'",
    objection: "Sdílej prosím zážitek ze služby který tě nějak oslovil nebo poučil.",
    goal: "Sdílet upřímný zážitek ze služby (1–2 minuty). Může být vtipný, dojemný nebo poučný. Zahrnout jak ses cítil/a a co sis vzal/a.",
    hint: "Nemusí to být velký příběh — i malá situace může ostatní povzbudit. Důležitá je upřímnost.",
    timeSeconds: 120,
    successCriteria: "Skupina hlasuje — sdílel/a {currentPlayer} konkrétní zážitek? Byl/a upřímný/á? Povzbudil ostatní?",
  },

  {
    id: "SBOR_OVOCE_DUCHA",
    title: "Ovoce ducha v praxi",
    category: "sborový život",
    difficulty: "easy",
    setting: "Diskuze ve skupině nebo po shromáždění",
    situation: "Skupina diskutuje o ovoci ducha. Přišla řada na tebe — vyber jedno ovoce ducha a vysvětli jak ho uplatňuješ v každodenním životě.",
    roleA: "Jsi na tahu. Vyber si jedno z ovoce ducha: láska, radost, pokoj, trpělivost, laskavost, dobrota, víra, mírnost, sebeovládání.",
    roleB: "Hraješ moderátora ({targetPlayer}). Řekni: '{currentPlayer}, které ovoce ducha by sis vybral/a jako to, na kterém teď pracuješ? A jak konkrétně ho uplatňuješ?'",
    objection: "Které ovoce ducha teď rozvíjíš a jak konkrétně ho uplatňuješ?",
    goal: "Upřímně pojmenovat jedno ovoce ducha. Uvést konkrétní situaci ze života kde ho uplatňuješ nebo kde na sobě pracuješ.",
    hint: "Galatským 5:22–23. Neboj se být upřímný i o tom kde se ti to nedaří — to povzbudí ostatní víc než dokonalá odpověď.",
    timeSeconds: 90,
    successCriteria: "Skupina hlasuje — byl/a {currentPlayer} upřímný/á? Uvedl/a konkrétní příklad? Povzbudil ostatní?",
  },

  {
    id: "SBOR_TYMY_BONUS",
    title: "Skupinová výzva — biblické verše naděje",
    category: "sborový život",
    difficulty: "easy",
    setting: "Skupinová aktivita ve sboru",
    situation: "Celá skupina má za úkol — každý hráč řekne jeden biblický verš o naději. Kdo uvede verš který ještě nezazněl, získá bod pro skupinu.",
    roleA: "Jsi na tahu. Řekni jeden biblický verš o naději — celou citaci nebo alespoň kde se nachází a o čem je.",
    roleB: "Hraješ moderátora ({targetPlayer}). Řekni: 'Skupinová výzva! Každý řekne jeden verš o naději. Začínáme u {currentPlayer}.'",
    objection: "Skupinová výzva! Řekni jeden verš o naději který ještě nezazněl.",
    goal: "Říct biblický verš o naději — ráj, vzkříšení, Boží království, konec utrpení. Skupina pokračuje dokola dokud někdo neopakuje.",
    hint: "Zjevení 21:3–4, Jan 5:28–29, Žalm 37:29, Izajáš 65:21–22, Skutky 24:15 — jsou jen příklady. Mnoho dalších!",
    timeSeconds: 60,
    successCriteria: "Skupina hlasuje — řekl/a {currentPlayer} verš o naději? Byl nový (nezazněl dřív)? Celá skupina se zapojila?",
  },

];

// ─────────────────────────────────────────────
//  ZPĚTNÁ KOMPATIBILITA — původní export
//  (pro části kódu které stále používají WITNESSING_SCENARIOS)
// ─────────────────────────────────────────────

export const WITNESSING_SCENARIOS = [
  ...DOORS_SCENARIOS,
  ...SERVICE_SCENARIOS,
];

// ─────────────────────────────────────────────
//  POMOCNÉ FUNKCE
// ─────────────────────────────────────────────

export const getRandomScenario = () => {
  const idx = Math.floor(Math.random() * WITNESSING_SCENARIOS.length);
  return WITNESSING_SCENARIOS[idx];
};

export const getRandomDoorsScenario = () => {
  const idx = Math.floor(Math.random() * DOORS_SCENARIOS.length);
  return DOORS_SCENARIOS[idx];
};

export const getRandomServiceScenario = () => {
  const idx = Math.floor(Math.random() * SERVICE_SCENARIOS.length);
  return SERVICE_SCENARIOS[idx];
};

export const getRandomCongregationScenario = () => {
  const idx = Math.floor(Math.random() * CONGREGATION_SCENARIOS.length);
  return CONGREGATION_SCENARIOS[idx];
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
    passage:          scenario.passage ? replace(scenario.passage) : undefined,
  };
};

export const SCENARIO_CATEGORIES = [
  "služba u dveří",
  "neformální svědectví",
  "biblické studium",
  "vozíčková služba",
  "povzbuzení ve sboru",
  "speciální situace",
  "strážní věž",
  "sborový život",
];
