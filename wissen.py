"""Wissens-Seiten (Toni 08.11.: „was hilft, sind Seiten wie ‚Was ist ein Wichtel‘ oder ‚Wie wichtelt man‘“).
build.py: wissen_pages() baut daraus je Seite HTML + FAQPage (+ HowTo bei Anleitung). Platzhalter im Text:
<!--CTA--> Auslosen-Kasten, <!--VIDEO_ERKLAERT--> / <!--VIDEO_KINDER--> eigene Videos (kein YouTube), <!--ERKL_KIND--> Vorlese-Kasten.
Neue Seite = Eintrag hier + Sitemap-Liste + og-Bild (marketing/render-og.js)."""

WISSEN = [
    dict(
        path='/wie-funktioniert-wichteln/',
        title='Wie funktioniert Wichteln? Regeln & Anleitung Schritt für Schritt',
        desc='Wie funktioniert Wichteln? Die Regeln einfach erklärt: Gruppe, Budget, Auslosen, Geheimhaltung und Bescherung – mit Anleitung in 6 Schritten, Tipps und häufigen Fehlern.',
        crumb='Wie funktioniert Wichteln?', mascot='winkt',
        photo=('wichtel3d-los', 'Plüsch-Wichtel zieht ein Los aus einer alten Holzkiste'),
        h1='Wie funktioniert Wichteln? Regeln und Anleitung',
        lead='Wichteln ist schnell erklärt: Jeder in der Gruppe zieht heimlich einen Namen und besorgt für genau diese Person ein kleines Geschenk. Bei der Bescherung packen alle aus – und raten, wer wohl wen gezogen hat. Hier steht Schritt für Schritt, wie es funktioniert, welche Regeln sich bewährt haben und was oft schiefgeht.',
        schritte=[
            ('Gruppe finden', 'Legt fest, wer mitmacht: Familie, Freunde, Team oder Klasse. Ab 3 Personen klappt Wichteln, richtig spannend wird es ab 5.'),
            ('Budget vereinbaren', 'Einigt euch auf einen festen Betrag, zum Beispiel 10 oder 20 Euro. So bekommt niemand ein viel teureres oder billigeres Geschenk als die anderen.'),
            ('Termin für die Bescherung festlegen', 'Ein Datum für das gemeinsame Auspacken – etwa die Weihnachtsfeier, der letzte Arbeitstag oder ein Adventssonntag.'),
            ('Namen auslosen', 'Jeder zieht genau einen Namen, aber nie den eigenen. Klassisch mit Zetteln, einfacher online: Namen eintragen, auslosen, jeder bekommt seinen geheimen Link.'),
            ('Geschenk besorgen – und schweigen', 'Jeder kauft oder bastelt ein Geschenk für die gezogene Person. Wen man hat, bleibt bis zur Bescherung geheim.'),
            ('Bescherung', 'Alle bringen ihr Geschenk mit, ohne Namen des Schenkenden. Ausgepackt wird reihum – danach darf geraten werden, wer wessen Wichtel war.'),
        ],
        body='''<h2>Wichteln in einem Satz</h2>
<p>Jeder beschenkt heimlich genau eine Person aus der Gruppe – und jeder bekommt genau ein Geschenk. Das unterscheidet Wichteln vom normalen Schenken: Niemand muss für alle etwas kaufen, und trotzdem geht keiner leer aus.</p>
<!--VIDEO_ERKLAERT-->

<h2>Anleitung: Wichteln in 6 Schritten</h2>
<!--SCHRITTE-->
<!--CTA-->

<h2>Die 10 wichtigsten Wichtel-Regeln</h2>
<ol>
  <li><b>Jeder zieht genau einen Namen</b> – und niemals sich selbst.</li>
  <li><b>Das Budget gilt für alle.</b> Ein bisschen darunter ist in Ordnung, deutlich darüber nicht.</li>
  <li><b>Geheim bleibt geheim.</b> Wer wen gezogen hat, verrät man nicht – auch nicht „nur dem Kollegen“.</li>
  <li><b>Kein Tauschen der Lose.</b> Wer seinen Namen nicht mag, behält ihn trotzdem. Ausnahme: Man hat sich versehentlich selbst gezogen.</li>
  <li><b>Paare und Geschwister</b> können sich ausschließen, wenn sie sich ohnehin beschenken.</li>
  <li><b>Das Geschenk kommt ohne Absender.</b> Ein Anhänger „Von deinem Wichtel“ reicht.</li>
  <li><b>Verpackt wird immer</b> – das Auspacken gehört zum Spaß.</li>
  <li><b>Bürotauglich schenken:</b> nichts Peinliches, nichts zu Persönliches, wenn man sich nicht gut kennt.</li>
  <li><b>Wer nicht zur Bescherung kommen kann,</b> gibt das Geschenk vorher bei jemandem ab.</li>
  <li><b>Raten ist erlaubt,</b> Auflösen ist freiwillig. Manche Gruppen lüften das Geheimnis nie.</li>
</ol>

<h2>Wie viel Geld gibt man beim Wichteln aus?</h2>
<p>Üblich sind <b>5 bis 10 Euro im Büro</b> und in der Schule, <b>15 bis 25 Euro unter Freunden</b> und in der Familie. Wichtig ist nicht die Höhe, sondern dass alle denselben Betrag kennen. Ideen nach Budget: <a href="/wichtelgeschenke-unter-5-euro/">unter 5 €</a> · <a href="/wichtelgeschenke-unter-10-euro/">unter 10 €</a> · <a href="/wichtelgeschenke-unter-20-euro/">unter 20 €</a> · <a href="/wichtelgeschenke-unter-30-euro/">unter 30 €</a>.</p>

<h2>Auslosen: Zettel oder online?</h2>
<p><b>Mit Zetteln</b> schreibt jeder seinen Namen auf, alle Zettel kommen in eine Mütze, und reihum wird gezogen. Das funktioniert, wenn alle im selben Raum sind – hat aber Tücken: Wer sich selbst zieht, muss neu ziehen, und am Ende passt es manchmal nicht auf. <b>Online</b> geht es schneller: Namen eintragen, auslosen, jeder bekommt seinen eigenen geheimen Link per WhatsApp oder E-Mail. Niemand zieht sich selbst, und auch der Organisator weiß nicht, wer wen hat. Wie das per Handy geht, steht unter <a href="/wichteln-per-whatsapp/">Wichteln per WhatsApp</a>.</p>

<h2>Häufige Fehler – und wie man sie vermeidet</h2>
<ul>
  <li><b>Kein Budget abgesprochen:</b> Dann steht die Schokolade neben dem Parfum. Immer vorher festlegen.</li>
  <li><b>Zu spät ausgelost:</b> Wer am Freitag zieht und am Montag beschert, hat Stress. Mindestens eine Woche Vorlauf einplanen, bei Versand per Post zwei.</li>
  <li><b>Alle Links in die Gruppe gepostet:</b> Dann kann jeder jeden sehen. Jeder bekommt nur seinen eigenen Link.</li>
  <li><b>Keine Ahnung, was die Person mag:</b> Ein <a href="/wunschzettel/">Wunschzettel</a> oder ein Tipp beim Auslosen hilft – oder der <a href="/geschenke-generator/">Geschenke-Generator</a>.</li>
</ul>

<h2>Varianten für mehr Spaß</h2>
<p>Klassisches Wichteln ist der Anfang. Beliebt sind auch <a href="/schrottwichteln/">Schrottwichteln</a> mit kuriosen Fundstücken, <a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a>, bei dem Geschenke den Besitzer wechseln, und Fern-Wichteln <a href="/wichteln-per-post/">per Post</a>. Alle Spielarten im Überblick: <a href="/wichteln-varianten/">12 Wichtel-Varianten</a>.</p>
<p>Woher der Brauch kommt, steht unter <a href="/woher-kommt-wichteln/">Woher kommt Wichteln?</a> – und was ein Wichtel eigentlich ist, unter <a href="/was-ist-ein-wichtel/">Was ist ein Wichtel?</a></p>''',
        faq=[
            ('Wie funktioniert Wichteln kurz erklärt?', 'Jeder in der Gruppe zieht heimlich einen Namen und schenkt dieser Person etwas im vereinbarten Budget. Bei der Bescherung packen alle aus und raten, wer wessen Wichtel war.'),
            ('Ab wie vielen Personen kann man wichteln?', 'Ab 3 Personen. Bei 2 Personen weiß jeder sofort, wer ihn beschenkt – dafür gibt es eigene Ideen unter „Wichteln zu dritt und zu zweit“.'),
            ('Was macht man, wenn man sich selbst zieht?', 'Mit Zetteln wird neu gezogen. Beim Online-Auslosen kann das nicht passieren, weil niemand sich selbst zugeteilt wird.'),
            ('Wie viel gibt man beim Wichteln aus?', 'Im Büro und in der Schule meist 5 bis 10 Euro, unter Freunden und in der Familie 15 bis 25 Euro. Wichtig ist, dass alle denselben Betrag kennen.'),
            ('Muss man verraten, wer man ist?', 'Nein. Ob das Geheimnis bei der Bescherung gelüftet wird, entscheidet die Gruppe. Viele lassen raten und lösen danach auf.'),
            ('Was ist der Unterschied zwischen Wichteln und Julklapp?', 'Julklapp ist ein alter Brauch aus Skandinavien und Norddeutschland, bei dem Geschenke heimlich ins Haus geworfen wurden. Wichteln ist die heutige Form mit Auslosen und Budget.'),
        ],
        og=('onni/sticker-winkt.png', 'Wie funktioniert Wichteln?', 'Regeln & Anleitung in 6 Schritten'),
    ),
    dict(
        path='/was-ist-ein-wichtel/',
        title='Was ist ein Wichtel? Aussehen, Herkunft & Bedeutung',
        desc='Was ist ein Wichtel? Woher der Name kommt, wie Wichtel aussehen, was sie tun – und der Unterschied zu Heinzelmännchen, Tomte, Nisse und Elfen. Mit Vorlesetext und Video für Kinder.',
        crumb='Was ist ein Wichtel?', mascot='lupe',
        photo=('wichtel3d-tuer', 'Plüsch-Wichtel mit roter Mütze steht vor einer kleinen Holztür'),
        h1='Was ist ein Wichtel? Aussehen, Herkunft und Bedeutung',
        lead='Ein Wichtel ist eine kleine Figur aus dem Volksglauben: ein winziger Hausgeist mit Zipfelmütze, der heimlich bei den Menschen wohnt, nachts hilft und Glück bringt – und niemals gesehen werden will. Von ihm hat das Wichteln seinen Namen. Hier steht, was man über Wichtel wissen muss, für Große und zum Vorlesen für Kinder.',
        body='''<h2>Woher kommt das Wort „Wichtel“?</h2>
<p>„Wichtel“ ist die Verkleinerung von <b>Wicht</b>. Im Althochdeutschen bedeutete „wiht“ einfach „Wesen“ oder „Ding“ – später wurde daraus ein Wort für kleine, geheimnisvolle Geschöpfe. Bis heute sagt man „kleiner Wicht“ zu einem Kind oder einem kleinen Menschen. Ein Wichtel ist also wörtlich ein „Wesenchen“: ein kleines Etwas, das man nicht genau zu fassen bekommt.</p>

<h2>Wie sieht ein Wichtel aus?</h2>
<ul>
  <li><b>Winzig:</b> meist nicht größer als eine Kaffeetasse oder eine Hand.</li>
  <li><b>Rote Zipfelmütze,</b> oft so tief ins Gesicht gezogen, dass man kaum die Augen sieht.</li>
  <li><b>Runde Knubbelnase</b> und bei vielen ein langer weißer Bart.</li>
  <li><b>Warme Kleidung:</b> Strickjacke, Schal, kleine Stiefel – Wichtel mögen es gemütlich.</li>
</ul>
<p>Dieses Bild stammt vor allem aus Skandinavien und hat sich über Weihnachtsdeko, Bücher und die Wichteltür bei uns durchgesetzt.</p>

<h2>Was macht ein Wichtel?</h2>
<p>Im Volksglauben lebt der Wichtel heimlich im Haus – unter den Dielen, hinter dem Ofen oder im Stall. Tagsüber merkt man nichts von ihm. Nachts, wenn alle schlafen, wird er fleißig: Er räumt auf, flickt Kleidung, passt auf Haus und Tiere auf und bringt Glück. Wer ihn gut behandelt, etwa mit einem Schälchen Brei, hat es gut. Wer ihn ärgert, muss mit kleinen Streichen rechnen. Und das wichtigste Gesetz: <b>Ein Wichtel will nie gesehen werden.</b></p>
<!--ERKL_KIND-->
<!--VIDEO_KINDER-->

<h2>Wichtel, Heinzelmännchen, Tomte, Nisse und Elfen – was ist der Unterschied?</h2>
<ul>
  <li><b>Heinzelmännchen</b> stammen aus einer Kölner Sage: Sie erledigten nachts die Arbeit der Handwerker – bis eine neugierige Frau sie sehen wollte und sie für immer verschwanden.</li>
  <li><b>Tomte</b> (Schweden) und <b>Nisse</b> (Dänemark, Norwegen) sind die skandinavischen Hofwichtel. Sie gehören dort fest zu Weihnachten und bekommen am Heiligabend Milchreis hingestellt.</li>
  <li><b>Elfen</b> aus dem englischen Sprachraum sind die Helfer des Weihnachtsmanns am Nordpol – größer, fröhlicher und weniger geheimnisvoll.</li>
  <li><b>Wichtel</b> ist bei uns der Oberbegriff für all diese kleinen, heimlichen Helfer.</li>
</ul>

<h2>Wichtel heute: Wichteltür und Wichteln</h2>
<p>Zwei Bräuche tragen den Wichtel bis heute weiter. Bei der <a href="/wichteltuer/">Wichteltür</a> zieht im Advent ein Wichtel hinter eine winzige Tür an der Wand ein, schreibt Briefe und macht kleine Streiche – vor allem Kinder lieben das. Und beim <a href="/wie-funktioniert-wichteln/">Wichteln</a> beschenken sich Erwachsene heimlich gegenseitig – genau wie der Wichtel, der Gutes tut, ohne gesehen zu werden.</p>
<p>Bei uns wohnt übrigens auch einer: <b>Onni</b>, der WichtelLos-Wichtel. Ab 1. Dezember erzählt er im <a href="/onni-adventskalender/">Onni-Adventskalender</a> jeden Tag eine neue Geschichte. Ausmalbilder gibt es unter <a href="/wichtel-ausmalbilder/">Wichtel-Ausmalbilder</a>, einen Namen für euren eigenen Wichtel im <a href="/wichteltuer/#wichtelname">Wichtelnamen-Generator</a>.</p>
<!--CTA-->''',
        faq=[
            ('Was ist ein Wichtel?', 'Ein Wichtel ist eine kleine Figur aus dem Volksglauben: ein winziger Hausgeist mit Zipfelmütze, der heimlich bei den Menschen wohnt, nachts hilft und Glück bringt und nie gesehen werden will.'),
            ('Woher kommt das Wort Wichtel?', 'Wichtel ist die Verkleinerung von Wicht. Das althochdeutsche „wiht“ bedeutete Wesen oder Ding – ein Wichtel ist also ein kleines Wesen.'),
            ('Wie groß ist ein Wichtel?', 'Meist wird er so klein beschrieben wie eine Kaffeetasse oder eine Hand.'),
            ('Was ist der Unterschied zwischen Wichtel und Heinzelmännchen?', 'Heinzelmännchen stammen aus einer Kölner Sage über nächtliche Helfer der Handwerker. Wichtel ist der allgemeine Begriff für kleine, heimliche Hausgeister.'),
            ('Was ist ein Tomte oder Nisse?', 'So heißen die Hofwichtel in Schweden (Tomte) und in Dänemark und Norwegen (Nisse). Sie gehören dort fest zu Weihnachten.'),
            ('Warum heißt Wichteln Wichteln?', 'Weil man wie ein Wichtel heimlich Gutes tut: Man beschenkt jemanden, ohne dass er weiß, von wem das Geschenk kommt.'),
        ],
        og=('onni/sticker-lupe.png', 'Was ist ein Wichtel?', 'Aussehen, Herkunft & Bedeutung'),
    ),
    dict(
        path='/wichteln-varianten/',
        title='Wichteln-Varianten: 12 Spielarten & Ideen für mehr Spaß',
        desc='Wichteln mal anders: 12 Varianten von Schrottwichteln über Würfeln und Themen-Wichteln bis Fern-Wichteln per Post – kurz erklärt, mit Regeln und Tipps für Büro, Familie und Freunde.',
        crumb='Wichteln-Varianten', mascot='wuerfel',
        photo=('wichtel3d-wuerfel', 'Plüsch-Wichtel sitzt neben großen Würfeln und Geschenken'),
        h1='Wichteln-Varianten: 12 Spielarten für mehr Spaß',
        lead='Jedes Jahr dasselbe Wichteln? Muss nicht sein. Hier sind 12 Spielarten – vom Klassiker über Schrottwichteln und Würfeln bis zum Wichteln per Post. Jede Variante mit kurzer Erklärung, für wen sie passt und worauf man achten sollte.',
        body='''<h2>1. Klassisches Wichteln</h2>
<p>Jeder zieht einen Namen und beschenkt diese Person heimlich im vereinbarten Budget. Der Klassiker für Familie, Freunde und Büro. Anleitung: <a href="/wie-funktioniert-wichteln/">Wie funktioniert Wichteln?</a></p>

<h2>2. Schrottwichteln</h2>
<p>Jeder bringt etwas mit, das zu Hause herumsteht und keiner braucht – je kurioser, desto besser. Die Geschenke werden meist ausgewürfelt. Perfekt für lustige Runden ohne Budget. Regeln und Ideen: <a href="/schrottwichteln/">Schrottwichteln</a>.</p>

<h2>3. Wichteln mit Würfeln</h2>
<p>Alle Geschenke liegen in der Mitte. Reihum wird gewürfelt: Bei einer 6 darf man sich ein Geschenk nehmen, später werden Geschenke getauscht oder geklaut. Ideal für die Weihnachtsfeier, weil niemand vorher auslosen muss. Regeln: <a href="/wichteln-wuerfeln-regeln/">Wichteln mit Würfeln</a>.</p>

<h2>4. Themen-Wichteln</h2>
<p>Alle Geschenke folgen einem Thema: „etwas Rotes“, „etwas zum Naschen“, „etwas für den Winter“ oder „etwas aus dem Lieblingsland“. Das Thema macht das Aussuchen leichter und sorgt für Gesprächsstoff.</p>

<h2>5. Buchstaben-Wichteln</h2>
<p>Jeder zieht zusätzlich einen Buchstaben – das Geschenk muss damit anfangen. „K“ wie Kerze, Kakao oder Kuschelsocken. Klingt einfach, wird aber schnell knifflig und lustig.</p>

<h2>6. Wichteln mit Aufgaben</h2>
<p>Statt nur zu schenken, bekommt jeder Wichtel eine kleine Aufgabe für seine Person: einen Kaffee hinstellen, eine Karte schreiben, ein Rätsel verstecken. Eine Woche lang, bis zur Bescherung. Passt gut ins Büro.</p>

<h2>7. Wichteln mit Rätseln</h2>
<p>Bis zur Bescherung schickt jeder Wichtel seiner Person Hinweise auf sich selbst: „Ich trinke keinen Kaffee“, „Ich sitze am Fenster“. Bei der Bescherung wird geraten. Digitale Rätselkarten gibt es mit dem <a href="/wichtelgruss/">Wichtelgruß</a>.</p>

<h2>8. Selbstgemacht-Wichteln</h2>
<p>Gekauft wird nichts – alles ist selbst gebacken, gebastelt oder gebraut. Persönlich und günstig. Ideen: <a href="/wichtelgeschenke-selber-machen/">Wichtelgeschenke selber machen</a>.</p>

<h2>9. Fern-Wichteln per Post</h2>
<p>Für Familie in verschiedenen Städten oder Teams im Homeoffice: online auslosen, Geschenke per Post schicken, gemeinsam per Videocall auspacken. Alles dazu: <a href="/wichteln-per-post/">Wichteln per Post</a>.</p>

<h2>10. Adventskalender-Wichteln</h2>
<p>Jeder befüllt einen Adventskalender für seine Person – 24 Kleinigkeiten statt eines Geschenks. Braucht Vorlauf bis Ende November. Ideen: <a href="/adventskalender-befuellen/">Adventskalender befüllen</a>.</p>

<h2>11. Wichteln für Kinder</h2>
<p>In Kita und Schule mit kleinem Budget, festen Regeln und Losen ohne Handy. Alles dazu: <a href="/wichteln-schule-kita/">Wichteln in Schule und Kita</a>. Für zu Hause gibt es den Brauch der <a href="/wichteltuer/">Wichteltür</a>.</p>

<h2>12. Engerl-Bengerl und Secret Santa</h2>
<p>Keine neue Spielart, aber andere Namen: In Bayern und Österreich heißt Wichteln „Engerl-Bengerl“, im Englischen „Secret Santa“. Die Geschichte dahinter steht unter <a href="/woher-kommt-wichteln/">Woher kommt Wichteln?</a></p>
<!--CTA-->

<h2>Welche Variante passt zu uns?</h2>
<ul>
  <li><b>Büro mit vielen Leuten:</b> Würfeln oder klassisch mit kleinem Budget – mehr unter <a href="/wichteln-im-buero/">Wichteln im Büro</a>.</li>
  <li><b>Freunde, die gerne lachen:</b> Schrottwichteln oder Buchstaben-Wichteln.</li>
  <li><b>Familie mit Kindern:</b> klassisch, mit Wunschzettel und Bescherung am Heiligabend.</li>
  <li><b>Kleine Gruppe:</b> Tipps unter <a href="/wichteln-zu-dritt/">Wichteln zu dritt und zu zweit</a>.</li>
</ul>''',
        faq=[
            ('Welche Arten von Wichteln gibt es?', 'Neben dem klassischen Wichteln gibt es Schrottwichteln, Wichteln mit Würfeln, Themen- und Buchstaben-Wichteln, Wichteln mit Aufgaben oder Rätseln, Selbstgemacht-Wichteln, Fern-Wichteln per Post und Adventskalender-Wichteln.'),
            ('Was ist Schrottwichteln?', 'Jeder bringt etwas Kurioses mit, das zu Hause herumsteht. Die Geschenke werden meist ausgewürfelt – es geht ums Lachen, nicht um den Wert.'),
            ('Wie geht Wichteln mit Würfeln?', 'Alle Geschenke liegen in der Mitte, reihum wird gewürfelt. Bei bestimmten Zahlen nimmt man sich ein Geschenk oder tauscht es mit jemand anderem.'),
            ('Was ist Themen-Wichteln?', 'Alle Geschenke folgen einem gemeinsamen Thema, zum Beispiel „etwas Rotes“ oder „etwas zum Naschen“.'),
            ('Welche Wichtel-Variante eignet sich fürs Büro?', 'Klassisches Wichteln mit kleinem Budget oder Wichteln mit Würfeln auf der Weihnachtsfeier – beides funktioniert auch, wenn man sich nicht gut kennt.'),
        ],
        og=('onni/sticker-jubel.png', 'Wichteln-Varianten', '12 Spielarten für mehr Spaß'),
    ),
    dict(
        path='/wichteln-zu-dritt/',
        title='Wichteln zu dritt oder zu zweit: So bleibt es spannend',
        desc='Wichteln zu dritt, zu zweit oder in kleiner Gruppe: Was anders ist, wie es trotzdem geheim bleibt und 6 Ideen, damit kleine Runden genauso viel Spaß machen.',
        crumb='Wichteln zu dritt', mascot='geschenk',
        photo=('wichtel3d-geschenk', 'Plüsch-Wichtel hält ein kleines Geschenk mit roter Schleife'),
        h1='Wichteln zu dritt oder zu zweit: so bleibt es spannend',
        lead='Wichteln lebt vom Geheimnis: Wer hat mich gezogen? In kleinen Gruppen ist das schwieriger – zu dritt gibt es nur zwei Möglichkeiten, zu zweit gar keine. Trotzdem lohnt es sich. Hier steht, was in kleinen Runden anders ist und mit welchen Ideen es spannend bleibt.',
        body='''<h2>Wichteln zu dritt: geht das?</h2>
<p>Ja. Zu dritt gibt es nur zwei mögliche Verteilungen: Anna beschenkt Ben, Ben beschenkt Clara, Clara beschenkt Anna – oder genau andersherum. Jeder weiß also: Mein Wichtel ist einer von zwei. Das klingt nach wenig Geheimnis, reicht aber zum Raten völlig aus – vor allem, wenn alle gut schauspielern.</p>
<p>Beim <a href="/">Auslosen mit WichtelLos</a> klappt das auch mit 3 Personen: Niemand zieht sich selbst, und jeder bekommt seinen eigenen geheimen Link.</p>

<h2>Wichteln zu zweit: dann eben anders</h2>
<p>Zu zweit weiß jeder sofort, von wem das Geschenk kommt – klassisches Wichteln funktioniert also nicht. Diese Varianten machen trotzdem Spaß:</p>
<ul>
  <li><b>Blind-Wichteln:</b> Beide legen ihr Geschenk in einen Sack, es wird gewürfelt, wer zuerst greift. Das Geheimnis ist nicht wer, sondern was.</li>
  <li><b>Themen-Duell:</b> Gleiches Thema, gleiches Budget – wer hat das bessere Geschenk gefunden?</li>
  <li><b>Rätsel-Wichteln:</b> Statt eines Absenders gibt es bis zur Bescherung Hinweise darauf, was im Paket ist.</li>
</ul>

<h2>6 Ideen für kleine Runden</h2>
<ol>
  <li><b>Zwei Geschenke pro Person:</b> Jeder zieht zwei Namen. Mehr Geschenke, mehr Raten.</li>
  <li><b>Geheime Helfer:</b> Eine Woche lang kleine anonyme Überraschungen – ein <a href="/wichtelgruss/">Wichtelgruß</a> per WhatsApp, ein Keks auf dem Schreibtisch.</li>
  <li><b>Buchstaben-Regel:</b> Das Geschenk muss mit einem gezogenen Buchstaben anfangen.</li>
  <li><b>Gemeinsam schenken:</b> Wer Partner oder Kinder hat, zieht als Team.</li>
  <li><b>Mehr Budget:</b> Weil jeder nur ein Geschenk besorgt, darf es in kleinen Runden etwas mehr sein.</li>
  <li><b>Würfeln mit Joker-Geschenken:</b> Jeder bringt ein Geschenk und einen Joker mit – beim <a href="/wichteln-wuerfeln-regeln/">Würfeln</a> wird alles durchgemischt.</li>
</ol>
<!--CTA-->

<h2>Ab wann lohnt sich klassisches Wichteln?</h2>
<p>Ab <b>3 Personen</b> funktioniert es, ab <b>5 Personen</b> wird das Raten richtig spannend, ab etwa <b>8 Personen</b> wird Wichteln für alle günstiger als Schenken an jeden. Für große Gruppen im Büro gibt es Tipps unter <a href="/wichteln-im-buero/">Wichteln im Büro</a>.</p>
<p>Mehr Spielarten: <a href="/wichteln-varianten/">12 Wichtel-Varianten</a> · Grundregeln: <a href="/wie-funktioniert-wichteln/">Wie funktioniert Wichteln?</a></p>''',
        faq=[
            ('Kann man zu dritt wichteln?', 'Ja. Zu dritt gibt es zwar nur zwei mögliche Verteilungen, aber jeder weiß nicht, welcher der beiden anderen sein Wichtel ist – das reicht zum Raten.'),
            ('Kann man zu zweit wichteln?', 'Klassisch nicht, weil jeder weiß, von wem das Geschenk kommt. Zu zweit funktionieren Varianten wie Blind-Wichteln, Themen-Duell oder Rätsel-Wichteln.'),
            ('Wie viele Personen braucht man zum Wichteln?', 'Mindestens 3. Richtig spannend wird es ab etwa 5 Personen.'),
            ('Wie lost man zu dritt aus, ohne sich selbst zu ziehen?', 'Am einfachsten online: Namen eintragen, auslosen – niemand wird sich selbst zugeteilt, und jeder bekommt seinen geheimen Link.'),
        ],
        og=('onni/sticker-geschenk.png', 'Wichteln zu dritt', 'Oder zu zweit – so bleibt es spannend'),
    ),
    dict(
        path='/wichteln-per-post/',
        title='Wichteln per Post: Fern-Wichteln ohne Treffen – so geht’s',
        desc='Wichteln per Post und ohne Treffen: online auslosen, Adressen sammeln, rechtzeitig verschicken und gemeinsam per Videocall auspacken. Mit Zeitplan, Versandtipps und Ideen, die gut ins Paket passen.',
        crumb='Wichteln per Post', mascot='winkt',
        photo=('wichtel3d-umschlag', 'Plüsch-Wichtel hält einen großen Briefumschlag'),
        h1='Wichteln per Post: Fern-Wichteln ohne Treffen',
        lead='Familie in verschiedenen Städten, Freunde im Ausland, Team im Homeoffice? Wichteln geht auch, wenn man sich nicht trifft. Ausgelost wird online, verschickt per Post, ausgepackt gemeinsam im Videocall. Hier steht, wie es reibungslos klappt.',
        body='''<h2>So funktioniert Wichteln per Post</h2>
<ol>
  <li><b>Online auslosen:</b> Namen eintragen, auslosen, jeder bekommt seinen geheimen Link per WhatsApp oder E-Mail – ohne dass sich jemand treffen muss. So geht's: <a href="/wichteln-per-whatsapp/">Wichteln per WhatsApp</a>.</li>
  <li><b>Adressen sammeln:</b> Jeder braucht die Adresse der Person, die er gezogen hat. Am einfachsten verschickt der Organisator eine Liste aller Adressen – dann verrät niemand, wen er hat.</li>
  <li><b>Budget inklusive Versand?</b> Vorher festlegen, ob das Porto zum Budget zählt. Unsere Empfehlung: Budget ohne Porto, dafür kleine, leichte Geschenke.</li>
  <li><b>Rechtzeitig verschicken:</b> Ein fester Stichtag für den Versand, damit alle Pakete vor der Bescherung da sind.</li>
  <li><b>Gemeinsam auspacken:</b> Per Videocall reihum öffnen – mit Raten, wer wessen Wichtel war.</li>
</ol>
<!--CTA-->

<h2>Zeitplan: wann auslosen, wann verschicken?</h2>
<ul>
  <li><b>3 Wochen vorher:</b> auslosen und Adressen verteilen.</li>
  <li><b>10 Tage vorher:</b> Geschenk verschicken. Im Dezember sind Pakete oft länger unterwegs.</li>
  <li><b>Ins Ausland:</b> zwei bis drei Wochen Versand einplanen und an den Zoll denken – außerhalb der EU lieber kleine, unkomplizierte Geschenke.</li>
  <li><b>Am Tag der Bescherung:</b> Videocall, alle Pakete ungeöffnet in der Hand.</li>
</ul>

<h2>Damit das Geheimnis bleibt</h2>
<ul>
  <li><b>Kein Absender</b> auf das Paket – oder den des Organisators.</li>
  <li><b>Direkt versenden lassen:</b> Viele Shops schicken auf Wunsch als Geschenk ohne Rechnung an eine andere Adresse.</li>
  <li><b>Ein Anhänger „Von deinem Wichtel“</b> ins Paket legen und „Erst am … öffnen!“ draufschreiben.</li>
  <li><b>Eine digitale Karte</b> dazu verschicken: Der <a href="/wichtelgruss/">Wichtelgruß</a> kommt anonym per Link.</li>
</ul>

<h2>Geschenke, die gut ins Paket passen</h2>
<p>Klein, leicht, unzerbrechlich: Socken, Tee, Schokolade, Bücher, Kartenspiele, Notizbücher, Gewürze. Nichts Flüssiges, nichts Verderbliches. Ideen nach Budget: <a href="/wichtelgeschenke-unter-10-euro/">unter 10 €</a> · <a href="/wichtelgeschenke-unter-20-euro/">unter 20 €</a> – oder passend zu Hobby und Person im <a href="/geschenke-generator/">Geschenke-Generator</a>.</p>
<p><b>Zu spät dran?</b> Dann verschick das Geschenk als <a href="/rubbellos/">Rubbellos per WhatsApp</a>: Die Person rubbelt frei, was sie bekommt, und das Paket kommt hinterher.</p>

<h2>Wichteln ohne Treffen im Team</h2>
<p>Im Homeoffice klappt Fern-Wichteln genauso. Tipp: Das Auspacken als festen Termin in den Kalender legen und jeder zeigt sein Geschenk in die Kamera. Mehr fürs Team: <a href="/wichteln-im-buero/">Wichteln im Büro</a> · <a href="/weihnachtsfeier-ideen/">Weihnachtsfeier-Ideen</a>.</p>''',
        faq=[
            ('Wie funktioniert Wichteln per Post?', 'Online auslosen, die Adressen verteilen, Geschenke rechtzeitig verschicken und gemeinsam per Videocall auspacken.'),
            ('Wann muss man beim Wichteln per Post verschicken?', 'Innerhalb Deutschlands etwa 10 Tage vor der Bescherung, ins Ausland zwei bis drei Wochen vorher.'),
            ('Zählt das Porto zum Wichtel-Budget?', 'Das legt die Gruppe fest. Meist gilt das Budget ohne Porto, dafür schenkt man etwas Kleines und Leichtes.'),
            ('Wie bleibt beim Wichteln per Post geheim, wer schenkt?', 'Kein Absender aufs Paket, direkt vom Shop als Geschenk liefern lassen oder den Organisator als Absender angeben.'),
            ('Kann man ohne Treffen wichteln?', 'Ja. Ausgelost wird online, verschickt per Post und ausgepackt im Videocall – auch im Homeoffice-Team.'),
        ],
        og=('onni/sticker-psst.png', 'Wichteln per Post', 'Fern-Wichteln ohne Treffen – so geht’s'),
    ),
]
