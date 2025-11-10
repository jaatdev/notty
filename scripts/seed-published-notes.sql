-- Seed published_notes table with test data
-- Run this in Supabase SQL editor to populate the published_notes table

INSERT INTO public.published_notes (
  note_key,
  subject_slug,
  topic_id,
  subtopic_id,
  title,
  body_html,
  payload,
  published_by
) VALUES
(
  'polity-preamble-complete',
  'polity',
  'preamble',
  'preamble-master',
  'The Preamble: Master Module (Complete Notes, Mnemonics, Flashcards & MCQs)',
  '<h2>The Preamble: Master Module</h2>
<h3>Source of Authority: We, The People of India</h3>
<p>Sovereignty rests with the people; the Constitution derives its authority from the citizens, not from any external power or monarch.</p>

<h3>Nature of State - SSCDR</h3>
<ul>
  <li><strong>Sovereign:</strong> Independent in internal and external affairs; not subordinate to any external power.</li>
  <li><strong>Socialist:</strong> Democratic socialism (added by 42nd Amendment) — aims to reduce socio-economic inequality; mixed economy model.</li>
  <li><strong>Secular:</strong> State has no official religion and treats all religions impartially (added by 42nd Amendment).</li>
  <li><strong>Democratic:</strong> People hold political power directly or via representatives; representative parliamentary democracy.</li>
  <li><strong>Republic:</strong> Head of state is elected (not hereditary).</li>
</ul>

<h3>Core Objectives - JLEF</h3>
<ul>
  <li><strong>Justice:</strong> Social Justice, Economic Justice, and Political Justice</li>
  <li><strong>Liberty:</strong> Thought, Expression, Belief, Faith and Worship (TEBFW)</li>
  <li><strong>Equality:</strong> Equality of status and Equality of opportunity</li>
  <li><strong>Fraternity:</strong> Dignity of the individual and Unity & Integrity of the Nation</li>
</ul>

<h3>Historical Context</h3>
<ul>
  <li><strong>Based on:</strong> Objectives Resolution (moved by Jawaharlal Nehru on 13 December 1946)</li>
  <li><strong>Adopted on:</strong> 26 November 1949</li>
  <li><strong>Came into effect:</strong> 26 January 1950 (Republic Day)</li>
  <li><strong>Only Amendment:</strong> 42nd Amendment (1976) added ''Socialist'', ''Secular'' and ''Integrity''</li>
</ul>

<h3>Key Judicial Cases</h3>
<ul>
  <li><strong>Berubari Union Case (1960):</strong> Held Preamble is NOT part of the Constitution (earlier view)</li>
  <li><strong>Kesavananda Bharati Case (1973):</strong> Held Preamble IS part of Constitution and embodies Basic Structure</li>
  <li><strong>LIC of India Case (1995):</strong> Reaffirmed Preamble is integral part of Constitution</li>
</ul>

<h3>Mnemonic Tricks</h3>
<ul>
  <li><strong>Nature (SSCDR):</strong> Strong Sexy Smart Desi Raja</li>
  <li><strong>Objectives (JLEF):</strong> Justice, Liberty, Equality, Fraternity</li>
  <li><strong>Liberty (TEBFW):</strong> Thali, Egg, Bag, Fan, Water</li>
  <li><strong>Justice (SEP):</strong> Social, Economic, Political</li>
</ul>

<h3>Complete MCQ Bank</h3>
<p>This note contains 99 comprehensive multiple-choice questions covering:</p>
<ul>
  <li>Constitutional basis and historical context</li>
  <li>SSCDR nature of state (Sovereign, Socialist, Secular, Democratic, Republic)</li>
  <li>JLEF objectives (Justice, Liberty, Equality, Fraternity)</li>
  <li>42nd Amendment changes and implications</li>
  <li>Judicial interpretation (Berubari, Kesavananda, LIC cases)</li>
  <li>Basic Structure doctrine</li>
  <li>Relationship with Fundamental Rights and Directive Principles</li>
  <li>Application and scope in constitutional interpretation</li>
  <li>Exam-focused questions with answers and reasoning</li>
</ul>',
  '{
    "type": "big-notes",
    "title": "The Preamble: Master Module",
    "excerpt": "Complete notes on Preamble with mnemonics and constitutional significance",
    "flashcards": [
      {"q": "What is the source of authority mentioned in the Preamble?", "a": "We, The People of India (sovereignty rests with the people)"},
      {"q": "List the five words describing the nature of the Indian state", "a": "Sovereign, Socialist, Secular, Democratic, Republic (SSCDR)"},
      {"q": "When was the Preamble adopted?", "a": "26 November 1949"},
      {"q": "Which amendment added ''Socialist'' and ''Secular''?", "a": "42nd Constitutional Amendment Act, 1976"},
      {"q": "What are the components of Justice in the Preamble?", "a": "Social Justice, Economic Justice and Political Justice"},
      {"q": "Name the five freedoms under Liberty", "a": "Thought, Expression, Belief, Faith and Worship (TEBFW)"},
      {"q": "What does ''Republic'' in the Preamble signify?", "a": "The head of state is elected, not hereditary"},
      {"q": "Which case held Preamble is part of Constitution and laid Basic Structure?", "a": "Kesavananda Bharati Case (1973)"},
      {"q": "What two assurances does Fraternity provide?", "a": "Dignity of the individual and Unity & Integrity of the Nation"},
      {"q": "What does ''Secular'' mean in the Preamble?", "a": "State has no official religion and treats all religions impartially"},
      {"q": "What does ''Sovereign'' mean?", "a": "India has internal and external independence, not subordinate to any external power"},
      {"q": "What does ''Socialist'' in Preamble imply?", "a": "Commitment to reduce socio-economic inequality; mixed economy model"},
      {"q": "What does ''Democratic'' in Preamble mean?", "a": "People hold political power directly or via representatives"},
      {"q": "When did Constitution come into effect?", "a": "26 January 1950 (Republic Day)"},
      {"q": "Which case said Preamble is NOT part of Constitution (1960)?", "a": "Berubari Union Case"},
      {"q": "What is ''Equality of status'' in Preamble?", "a": "No special privileges; equal treatment of all citizens"},
      {"q": "What is ''Equality of opportunity'' in Preamble?", "a": "Equal access to social, economic and political opportunities"},
      {"q": "Which amendment also added the word ''Integrity''?", "a": "42nd Amendment - added to ''Unity & Integrity''"},
      {"q": "Who is N.A. Palkiwala?", "a": "Jurist who called Preamble ''Identity Card of the Constitution''"},
      {"q": "How does Preamble help courts?", "a": "Courts use it to interpret ambiguous constitutional provisions"},
      {"q": "What is ''Fraternity'' in context of Preamble?", "a": "Promotes brotherhood and national unity, removes discrimination"},
      {"q": "Is Preamble directly enforceable as a right?", "a": "No, but used for interpretation and embodies Basic Structure"},
      {"q": "Can Preamble be amended?", "a": "Yes, subject to not violating the Basic Structure doctrine"},
      {"q": "Which article guarantees freedom of speech (Liberty objective)?", "a": "Article 19 of the Constitution"},
      {"q": "How many MCQs are in full preamble question bank?", "a": "99 comprehensive questions covering all aspects"}
    ],
    "sections": [
      {"heading": "Introduction to Preamble", "content": "The Preamble is the identity card of the Constitution and serves as an interpretation guide for ambiguous provisions"},
      {"heading": "SSCDR Mnemonic", "content": "Sovereign (Independent), Socialist (Equal wealth), Secular (No state religion), Democratic (People power), Republic (Elected head)"},
      {"heading": "JLEF Objectives", "content": "Justice (3 types), Liberty (5 freedoms), Equality (status & opportunity), Fraternity (unity & dignity)"}
    ]
  }',
  'admin@example.com'
),
(
  'polity-article-15-equality',
  'polity',
  'fundamental-rights',
  'article-15',
  'Article 15: Right to Equality',
  '<h2>Article 15: Right to Equality</h2>
<p>Article 15 of the Indian Constitution is a fundamental right that ensures equality before the law and prohibits discrimination on the grounds of religion, race, caste, sex, or place of birth.</p>
<h3>Key Points:</h3>
<ul>
  <li>Applies to all citizens of India</li>
  <li>Prohibits discrimination by the State</li>
  <li>Covers all public places, shops, and facilities</li>
  <li>Allows affirmative action for scheduled castes and tribes</li>
</ul>
<h3>Grounds of Discrimination (RRCSP):</h3>
<ul>
  <li><strong>R</strong>eligion - Cannot discriminate based on religious beliefs</li>
  <li><strong>R</strong>ace - Cannot discriminate based on racial origin</li>
  <li><strong>C</strong>aste - Cannot discriminate based on caste affiliation</li>
  <li><strong>S</strong>ex - Cannot discriminate based on gender</li>
  <li><strong>P</strong>lace of birth - Cannot discriminate based on birthplace</li>
</ul>
<h3>Constitutional Amendments to Article 15:</h3>
<ul>
  <li>15(3) - Special provisions for women and children</li>
  <li>15(4) - Added by 1st Amendment (1951) - Special provisions for SC/ST and backward classes</li>
  <li>15(5) - Added by 93rd Amendment (2005) - Special provisions for admission in educational institutions</li>
  <li>15(6) - Added by 103rd Amendment (2019) - Economically weaker sections (EWS) reservation</li>
</ul>',
  '{
    "type": "big-notes",
    "title": "Article 15: Right to Equality",
    "excerpt": "Complete guide to Article 15 with grounds, amendments and case law",
    "flashcards": [
      {"q": "What does Article 15 prohibit?", "a": "Discrimination on grounds of religion, race, caste, sex, or place of birth"},
      {"q": "Does Article 15 apply to private entities?", "a": "No, Article 15 applies only to the State and its actions"},
      {"q": "Can the State provide affirmative action?", "a": "Yes, the State can make provisions for Scheduled Castes, Scheduled Tribes, and OBC"},
      {"q": "What is the mnemonic for grounds of discrimination?", "a": "RRCSP - Religion, Race, Caste, Sex, Place of birth"},
      {"q": "Which amendment added special provisions for SC/ST?", "a": "1st Amendment (1951)"},
      {"q": "Which amendment introduced EWS reservation?", "a": "103rd Amendment (2019)"},
      {"q": "What is Article 15(5)?", "a": "Added by 93rd Amendment (2005) - Special provisions for admission in educational institutions"}
    ],
    "sections": [
      {"heading": "Understanding Discrimination", "content": "Article 15 applies only to the State and does not prevent private discrimination"},
      {"heading": "RRCSP Grounds", "content": "Religion, Race, Caste, Sex, Place of birth - the five prohibited grounds"},
      {"heading": "Evolution through Amendments", "content": "From basic equality (1950) to EWS reservation (2019) - progressive expansion"}
    ]
  }',
  'admin@example.com'
),
(
  'polity-article-14-equality',
  'polity',
  'fundamental-rights',
  'equality-before-law',
  'Article 14: Equality Before the Law',
  '<h2>Article 14: Equality Before the Law</h2>
<p>Article 14 is the foundational equality provision that guarantees that the State shall not deny any person equality before the law or equal protection of the laws within the territory of India.</p>

<h3>Key Concepts:</h3>
<ul>
  <li><strong>Equality before Law:</strong> The law applies equally to all persons, no person is above the law</li>
  <li><strong>Equal Protection of Laws:</strong> Similar laws apply equally to all in similar circumstances</li>
  <li><strong>Applies to State Action:</strong> Binds the government and its agencies</li>
</ul>

<h3>What is Reasonable Classification?</h3>
<p>The State can make laws that classify persons, but such classification must be:</p>
<ul>
  <li>Based on intelligible differentia (clear, reasonable basis)</li>
  <li>Related to the object sought to be achieved by the law</li>
  <li>Not arbitrary or discriminatory</li>
</ul>

<h3>Doctrine of Colourable Legislation:</h3>
<p>The State cannot use classification as a cover to discriminate against a particular community or person.</p>

<h3>Important Cases:</h3>
<ul>
  <li><strong>Granville Austin:</strong> Article 14 is the ''most important'' provision of the Constitution</li>
  <li><strong>AIR Case (1997):</strong> Settled the test for reasonable classification</li>
  <li><strong>Shayara Bano Case (2017):</strong> Discussed discriminatory personal laws and equality</li>
</ul>',
  '{
    "type": "big-notes",
    "title": "Article 14: Equality Before the Law",
    "excerpt": "Foundation of equality rights in Indian Constitution",
    "flashcards": [
      {"q": "What does Article 14 guarantee?", "a": "No person shall be denied equality before law or equal protection within Indian territory"},
      {"q": "What is ''equality before law''?", "a": "The law applies equally to all persons; no person is above the law"},
      {"q": "What is ''equal protection of laws''?", "a": "Similar laws apply equally to all persons in similar circumstances"},
      {"q": "Can the State classify people?", "a": "Yes, but classification must be based on intelligible differentia and related to object of law"},
      {"q": "What is ''Reasonable Classification''?", "a": "Classification that is rationally based and not arbitrary or discriminatory"},
      {"q": "What is ''Colourable Legislation''?", "a": "Using classification as a cover to discriminate, which is not permitted"},
      {"q": "Does Article 14 apply to private persons?", "a": "No, it applies only to State action"},
      {"q": "Can exceptions to equality be made?", "a": "Yes, if based on reasonable classification related to the purpose of law"}
    ],
    "sections": [
      {"heading": "Core Principle", "content": "Equality before law means no person is above the law and all are subject to same law"},
      {"heading": "Reasonable Classification Test", "content": "4-part test: Intelligible differentia, Related to object, Not arbitrary, Not discriminatory"},
      {"heading": "Historical Significance", "content": "Article 14 is considered the foundation of equality rights in the Constitution"}
    ]
  }',
  'admin@example.com'
),
(
  'history-french-revolution',
  'history',
  'modern-world',
  'europe',
  'The French Revolution (1789-1799)',
  '<h2>The French Revolution (1789-1799)</h2>
<p>The French Revolution was a period of radical social and political upheaval in France that fundamentally changed European history.</p>
<h3>Causes:</h3>
<ul>
  <li>Financial crisis and excessive taxation</li>
  <li>Enlightenment ideals spreading</li>
  <li>Poor harvest and famine</li>
  <li>Growing discontent with absolute monarchy</li>
</ul>
<h3>Major Events:</h3>
<ul>
  <li>Storming of the Bastille (July 14, 1789)</li>
  <li>Declaration of Rights of Man and Citizen</li>
  <li>Abolition of feudalism</li>
  <li>Reign of Terror (1793-1794)</li>
</ul>
<h3>Key Figures:</h3>
<ul>
  <li>Maximilien Robespierre - Leader of Reign of Terror, executed July 28, 1794</li>
  <li>Georges Danton - Revolutionary leader, advocated moderation, executed 1794</li>
  <li>Jean-Paul Marat - Radical journalist and politician</li>
  <li>Napoleon Bonaparte - Military general who ended the Revolution in 1799</li>
</ul>',
  '{
    "type": "quick-reference",
    "title": "The French Revolution",
    "items": [
      {"title": "1789", "text": "French Revolution begins; Bastille stormed on July 14; Declaration of Rights adopted"},
      {"title": "1791", "text": "Royal family attempts escape to Varennes; Constitution adopted; Assembly dissolved"},
      {"title": "1792", "text": "War declared against Austria; September Massacres; Republic proclaimed; Monarchy abolished"},
      {"title": "1793", "text": "King Louis XVI executed; Reign of Terror begins; Robespierre in power"},
      {"title": "1794", "text": "Robespierre executed (Thermidorian Reaction); Terror ends; Directory takes power"},
      {"title": "1799", "text": "Revolution ends with Napoleon''s coup d''etat (18 Brumaire); Consulate established"}
    ],
    "flashcards": [
      {"q": "When did the French Revolution start?", "a": "1789"},
      {"q": "What was the Bastille?", "a": "A fortress-prison in Paris, symbol of royal tyranny, stormed on July 14, 1789"},
      {"q": "When was the Reign of Terror?", "a": "1793-1794, under Robespierre''s leadership"},
      {"q": "Who executed Robespierre?", "a": "His own guillotine killed him on July 28, 1794 (Thermidorian Reaction)"},
      {"q": "When was King Louis XVI executed?", "a": "January 21, 1793"},
      {"q": "Who ended the French Revolution?", "a": "Napoleon Bonaparte with his coup d''etat on November 9, 1799"}
    ]
  }',
  'admin@example.com'
),
(
  'economics-supply-demand',
  'economics',
  'microeconomics',
  'market-mechanisms',
  'Supply and Demand: Market Fundamentals',
  '<h2>Supply and Demand: Market Fundamentals</h2>
<p>Supply and demand are the core mechanisms that drive market prices and quantities in an economy.</p>
<h3>The Law of Demand:</h3>
<p>When the price of a good increases, the quantity demanded decreases (and vice versa), assuming all other factors remain constant (Ceteris Paribus).</p>
<h3>The Law of Supply:</h3>
<p>When the price of a good increases, suppliers are willing to produce and sell more (and vice versa).</p>
<h3>Market Equilibrium:</h3>
<p>The point where quantity supplied equals quantity demanded, determining the market price and quantity.</p>
<h3>Determinants of Demand:</h3>
<ul>
  <li>Consumer preferences and tastes</li>
  <li>Income levels of consumers</li>
  <li>Prices of related goods (substitutes and complements)</li>
  <li>Population and demographics</li>
  <li>Expectations about future prices</li>
</ul>
<h3>Determinants of Supply:</h3>
<ul>
  <li>Production costs (raw materials, labor)</li>
  <li>Technology and innovation</li>
  <li>Number of suppliers in market</li>
  <li>Expectations about future prices</li>
  <li>Government policies and taxes</li>
</ul>',
  '{
    "type": "big-notes",
    "title": "Supply and Demand: Market Fundamentals",
    "excerpt": "Understanding the fundamental forces that determine prices and quantities in markets",
    "flashcards": [
      {"q": "What is the Law of Demand?", "a": "Higher price leads to lower quantity demanded; lower price leads to higher quantity demanded"},
      {"q": "What is the Law of Supply?", "a": "Higher price leads to higher quantity supplied; lower price leads to lower quantity supplied"},
      {"q": "What is market equilibrium?", "a": "The point where quantity demanded equals quantity supplied, determining market price"},
      {"q": "What causes a shift in demand curve?", "a": "Changes in consumer preferences, income, population, or prices of related goods"},
      {"q": "What causes a shift in supply curve?", "a": "Changes in production costs, technology, number of suppliers, or government policies"},
      {"q": "What is a shortage?", "a": "When quantity demanded exceeds quantity supplied at current price"},
      {"q": "What is a surplus?", "a": "When quantity supplied exceeds quantity demanded at current price"},
      {"q": "What is Ceteris Paribus?", "a": "''All other things being equal'' - assumption that other variables don''t change"}
    ],
    "sections": [
      {"heading": "Understanding Demand", "content": "Demand is the quantity of goods consumers are willing to buy at various prices"},
      {"heading": "Understanding Supply", "content": "Supply is the quantity of goods producers are willing to sell at various prices"},
      {"heading": "Market Equilibrium", "content": "Market finds balance between supply and demand, establishing equilibrium price and quantity"}
    ]
  }',
  'admin@example.com'
);

-- Verify the insert
SELECT note_key, title, subject_slug, published_at FROM public.published_notes ORDER BY published_at DESC;
