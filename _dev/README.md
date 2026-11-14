# Portfolio — οδηγός

## Δομή (τι ανεβαίνει στο hosting)
    index.html        οθόνη κωδικού (δεν περιέχει κανένα κείμενο ή εικόνα)
    projects.html     όλο το περιεχόμενο: Information (bio), projects, κείμενα, slides
    css/style.css     όλο το design (πάνω-πάνω τα variables: χρώματα, πλάτη, χρόνοι)
    js/script.js      ώρα Αθήνας, κωδικός, slides, πληκτρολόγιο
    img/<project>/    εικόνες και βίντεο ανά project: emst, eleusis, manna, bauhaus, efthimis, ff, siff, tim, anther, picky, aiap
                      αρχεία <project>-NN.jpg (ή .mp4 + <project>-NN-poster.jpg), με τη σειρά των slides
    files/            CV.pdf (το link "cv here" στο Information)
    robots.txt  _headers  .htaccess   noindex για μηχανές αναζήτησης
    _dev/             ΔΕΝ ανεβαίνει (αυτός ο οδηγός + password-maker.html)

## Τι επεξεργάζεσαι
- `projects.html`: το bio (μέσα στο `<div class="bio">`), τα project (title, κείμενο, slides).
  Ένα `<figure class="slide">` = μία εικόνα ή ένα βίντεο. Πρόσθεσε όσα θέλεις, τίποτα άλλο δεν αλλάζει.
  Tags μεγέθους: `slide` | `slide full` (100% x 100%, κόβει) | `slide full fit` (ολόκληρη, χωρίς κόψιμο).
- Νέο project: αντίγραψε ένα ολόκληρο `<section class="proj">` και δώσε νέο id (i5, i6 ...). Το Manna έχει προσωρινό τίτλο/κείμενο.
- Εικόνες: έως 2400px στη μεγάλη πλευρά, JPEG ποιότητα 82, συνήθως 200–700 KB η καθεμία (βλ. οδηγό συμπίεσης παρακάτω).

## Πώς δουλεύουν τα δύο κουμπιά
- **Information** (πάνω αριστερά): ανοίγει το bio. Η σελίδα θολώνει, τα υπόλοιπα κείμενα χαμηλώνουν.
- **Read more** (κάτω, ανά project): ανοίγει το κείμενο του project, μετά γίνεται **Close**.
- Κλείνουν με κλικ οπουδήποτε αλλού ή με Esc. Ανοιχτό μόνο το ένα κάθε φορά. Όσο είναι ανοιχτό, το scroll και τα βελάκια κλειδώνουν.
- Πλήκτρα: ← → εικόνα, ↑ ↓ project, Esc κλείνει.

## Αλλαγή κωδικού
Άνοιξε `_dev/password-maker.html`, γράψε τον νέο κωδικό, αντίγραψε τις 2 γραμμές που βγάζει στο `js/script.js` (SALT/HASH).
Τώρα είναι `hello`.

## Βίντεο
- Σιωπηλά loops, `autoplay muted loop playsinline preload="auto"` και `poster="..."`.
- Εξαγωγή με ffmpeg (γρήγορο ξεκίνημα, σταθερά 25 fps):
  `ffmpeg -i in.mov -vf "fps=25,scale=1920:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -an -movflags +faststart out.mp4`
  Το `+faststart` είναι το σημαντικό: χωρίς αυτό ο browser περιμένει να κατέβει όλο το αρχείο πριν παίξει.

## Προστασία (ειλικρινά)
Οθόνη κωδικού + noindex = "κουδούνι", όχι κλειδαριά. Πραγματικός κωδικός γίνεται στον server:
`.htaccess` basic auth (βγάλε τα # από τις 4 γραμμές AuthType...) ή Cloudflare Access.

## Συμπίεση εικόνων (όταν προσθέτεις νέες)
Έως 2400px στη μεγάλη πλευρά, JPEG ποιότητα ~82, progressive, sRGB. Διαφάνειες γίνονται μαύρες (το site είναι μαύρο).
Στο Photoshop/Lightroom: Export for Web, JPEG 80–85. Ή με ImageMagick:
`magick in.jpg -auto-orient -resize "2400x2400>" -strip -interlace Plane -quality 82 -colorspace sRGB out.jpg`

## Πώς φτιάχτηκαν τα slides από το Figma
- Κάθε board του Figma (1920×1150) είναι ολοκληρωμένη σύνθεση, γι' αυτό όλα μπαίνουν με `slide full`. Σειρά = από αριστερά προς τα δεξιά, όπως στο Figma.
- Εικόνες: JPG, πλάτος έως 2400px, ποιότητα 82.
- Boards με βίντεο: το Figma δίνει τα βίντεο χωριστά (όχι ολόκληρο το board). Ξαναφτιάχτηκε η σύνθεση (φόντο, θέση, μέγεθος) και βγήκε ένα mp4 ανά board.
  Το Figma τεντώνει ένα βίντεο στο κάδρο του, και το ίδιο έγινε εδώ. Τα posters βγαίνουν από το πρώτο καρέ.
- Τίτλοι/κείμενα: τα νέα projects (Future Format, SIFF, The Invisible Map, Anther, Picky Productions, AIAP) έχουν προσωρινό κείμενο "Project description coming soon.".

## Πλοήγηση (βελάκια, χωρίς κουμπιά Back/Next)
- Αριστερή μισή οθόνη = προηγούμενη εικόνα (βέλος αριστερά). Δεξιά μισή = επόμενη (βέλος δεξιά). Δεν υπάρχει βέλος προς τα κάτω.
- Στην τελευταία εικόνα ενός project το "επόμενη" πηγαίνει στο project από κάτω. Στο τελευταίο project γυρίζει στο πρώτο (με σύντομο μαύρο fade).
- Ολόκληρος ο τίτλος (και το Read more) ανοίγει/κλείνει το κείμενο. Κλικ οπουδήποτε έξω από τον τίτλο/κείμενο το κλείνει. Το Information κλείνει με κλικ έξω ή Esc.
- Τα βέλη είναι cursors: `css/cursors/arrow-left.svg`, `arrow-right.svg`. Αντικατάστησέ τα με τα δικά σου από το Figma (Export → SVG, 32×32, ίδια ονόματα).
- Αριθμητής εικόνων κάτω δεξιά (`01/17`), αυτόματα. Περιθώριο 15px γύρω από όλα τα κείμενα: `--pad` στο `css/style.css`. Πλάτος τίτλου: `--title-w` (50vw).
- Όταν ανοίγει το Information ή το Read more, η εικόνα μικραίνει λίγο (`--open-scale`, 1 = όχι), θολώνει και τα κείμενα γίνονται απλό λευκό.
- Τίτλος κάθε project: 3 γραμμές `Project: … / Client: … / Type, year: …` μέσα στο `<p class="title">` (με `<br>` ανάμεσα). Όπου γράφει [to add] συμπληρώνεις εσύ.

## Πλοήγηση (βελάκια, χωρίς κουμπιά Back/Next)
- Αριστερή μισή οθόνη = προηγούμενη εικόνα (βέλος αριστερά). Δεξιά μισή = επόμενη (βέλος δεξιά).
  Στην τελευταία εικόνα ενός project το "επόμενη" πηγαίνει στο project από κάτω.
- Κάτω μπάρα, δεξιό μέρος = επόμενο project (βέλος κάτω). Κάτω αριστερά (τίτλος, Read more) και το Information έχουν το κανονικό δείκτη.
- Τα βέλη είναι cursors: `css/cursors/arrow-left.svg`, `arrow-right.svg`, `arrow-down.svg`. Αντικατάστησέ τα με τα δικά σου από το Figma
  (Export → SVG, 32×32, ίδια ονόματα αρχείων). Οι ζώνες ρυθμίζονται από `--bar-h` και `--cta-w` στο `css/style.css`.
- Αριθμητής εικόνων κάτω δεξιά (`01/17`), φτιάχνεται αυτόματα. Η μορφή αλλάζει στη γραμμή `counter.textContent` του `js/script.js`.
- Όταν ανοίγει το Information ή το Read more, η εικόνα μικραίνει (`--open-scale`, 1 = όχι), θολώνει και τα κείμενα γίνονται απλό λευκό.

## Τύπος
Λευκός, με `mix-blend-mode: difference` (τελευταίο block του `css/style.css`: σβήστο για απλό κείμενο).

## Έτος στην οθόνη κωδικού
Το `© 2026` ενημερώνεται μόνο του κάθε χρόνο από το `js/script.js` (id="year" στο `index.html").
