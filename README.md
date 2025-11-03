# Taiga - FUZZY [SIZE-GUIDE]

Tema Shopify per **it-alysi.myshopify.com** con funzionalità avanzate per la guida alle taglie.

## 📋 Descrizione

Questo repository contiene il tema **Taiga - FUZZY [SIZE-GUIDE]** in versione bozza, ottimizzato con un sistema di guida alle taglie dinamico e semplificato.

## 🎯 Caratteristiche Principali

### Guida alle Taglie Avanzata
- **Sistema tabellare dinamico** con supporto colspan per taglie STD
- **Conversione taglie** per abbigliamento (IT, EU, FR, US, UK)
- **Conversione taglie denim** con misure specifiche
- **Misure del corpo** dettagliate (Busto, Vita, Fianchi)
- **Taglie calzature** con conversioni internazionali
- **Info modella** personalizzabile

### Gestione Semplificata
- Dati inseribili tramite **textarea** invece di centinaia di campi separati
- Formato pipe-separated (`|`) per celle delle tabelle
- Configurazione colspan dinamici per flessibilità massima

## 📁 Struttura File Modificati

### File Principali

#### `sections/size-modal.liquid`
Sezione modal per la guida alle taglie con:
- Tabelle HTML native con colspan dinamici
- Script JavaScript ottimizzato
- Migliore accessibilità (ARIA labels)
- Supporto per 3 tipi di blocchi:
  - Conversione taglie abbigliamento
  - Misure del corpo
  - Taglie calzature

#### `assets/custom-style-size-modal.css`
Stili CSS per il modal della guida taglie:
- Design responsive
- Tabelle con bordi e padding ottimizzati
- Supporto mobile con scroll orizzontale
- Stili per sottotitoli e sezioni

#### `assets/size-modal.css`
CSS base per il sistema modal del tema.

## 🚀 Aggiornamenti Recenti

### Versione attuale (2024-11-03)
- ✅ Aggiornato `size-modal.liquid` dalla versione OTT25
- ✅ Ottimizzato `custom-style-size-modal.css` per tabelle HTML
- ✅ Ridotto codice da ~1500 righe a ~250 righe
- ✅ Implementato sistema tabellare dinamico

### Miglioramenti rispetto alla versione precedente
- **-80% di codice** (da 1500 a 250 righe)
- **Gestione più semplice** dei dati tramite textarea
- **Maggiore flessibilità** con colspan dinamici
- **Migliore accessibilità** con attributi ARIA
- **Performance ottimizzata** con JavaScript moderno

## 🔧 Come Configurare la Guida Taglie

### 1. Conversione Taglie Abbigliamento

**Gruppi STD con colspan:**
```
XS:1,S:2,M:1,L:1,XL:1
```

**Righe conversione (formato pipe-separated):**
```
IT|38|40|42|44|46|48
EU|34|36|38|40|42|44
FR|34|36|38|40|42|44
US|2|4|6|8|10|12
UK|6|8|10|12|14|16
```

### 2. Conversione Taglie Denim

```
25|26|27|28|29|30|31|32
38|40|40 1/2|42|42 1/2|44|44 1/2|46
```

### 3. Misure del Corpo

**Colonne:**
```
38,40,42,44,46,48
```

**Righe:**
```
Busto|80 cm|84 cm|88 cm|92 cm|96 cm|100 cm
Vita|64 cm|68 cm|72 cm|76 cm|80 cm|88 cm
Fianchi|88 cm|92 cm|96 cm|100 cm|104 cm|108 cm
```

### 4. Taglie Calzature

**Colonne:**
```
IT,FR/EU,UK,US
```

**Righe:**
```
36|36|3.5|6
37|37|4|6.5
38|38|5|7.5
39|39|5.5|8
40|40|6.5|9
41|41|7|9.5
```

## 💻 Comandi Shopify CLI

### Setup Iniziale
```bash
# Autenticazione
shopify auth logout
shopify theme list --store it-alysi.myshopify.com

# Download tema
shopify theme pull --store it-alysi.myshopify.com --theme "Taiga - FUZZY [SIZE-GUIDE]"
```

### Sviluppo
```bash
# Modalità sviluppo (live sync)
shopify theme dev --store it-alysi.myshopify.com --theme "Taiga - FUZZY [SIZE-GUIDE]"

# Push modifiche
shopify theme push --store it-alysi.myshopify.com --theme "Taiga - FUZZY [SIZE-GUIDE]"

# Verifica tema
shopify theme check
```

## 🔗 Link Utili

- **Anteprima Tema**: [https://it-alysi.myshopify.com?preview_theme_id=182433841486](https://it-alysi.myshopify.com?preview_theme_id=182433841486)
- **Editor Tema**: [https://it-alysi.myshopify.com/admin/themes/182433841486/editor](https://it-alysi.myshopify.com/admin/themes/182433841486/editor)
- **Store Admin**: [https://it-alysi.myshopify.com/admin](https://it-alysi.myshopify.com/admin)

## 📦 Struttura Directory

```
SIZE GUIDE ALYSI/
├── assets/                    # File statici (CSS, JS, immagini)
│   ├── size-modal.css         # CSS base modal
│   ├── custom-style-size-modal.css  # CSS personalizzato
│   └── [altri asset...]
├── config/                    # Configurazioni tema
│   ├── settings_data.json     # Dati configurazione
│   └── settings_schema.json   # Schema impostazioni
├── layout/                    # Layout principali
├── locales/                   # Traduzioni
│   ├── it.json               # Italiano
│   ├── en.default.json       # Inglese
│   └── [altre lingue...]
├── sections/                  # Sezioni tema
│   ├── size-modal.liquid     # ⭐ Modal guida taglie
│   └── [altre sezioni...]
├── snippets/                  # Snippet riutilizzabili
│   ├── product-variant-picker.liquid  # Contiene bottone size-link
│   └── [altri snippet...]
└── templates/                 # Template pagine

```

## ⚠️ Note Importanti

- Questo è un **tema in bozza**, non è live
- Testare sempre le modifiche prima di pubblicare
- Il tema è basato su **Taiga - FUZZY [OTT25]** per la guida taglie
- ID Tema: **182433841486**

## 🤝 Contributi

Repository mantenuto da [@alexandrutiuliuliuc-cloud](https://github.com/alexandrutiuliuliuc-cloud)

## 📝 License

Proprietario: Alysi (it-alysi.myshopify.com)

---

**Ultimo aggiornamento:** 3 Novembre 2024

