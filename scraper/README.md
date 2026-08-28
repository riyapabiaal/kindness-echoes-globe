# Echoes of Kindness — Java scraper

Standalone Jsoup scraper that pulls top post titles from r/MadeMeSmile,
r/HumansBeingBros and r/UpliftingNews, assigns randomized (land-biased) global
coordinates, and writes `public/seed_data.json`.

```bash
cd scraper
curl -sLO https://repo1.maven.org/maven2/org/jsoup/jsoup/1.17.2/jsoup-1.17.2.jar
javac -cp jsoup-1.17.2.jar KindnessScraper.java
java -cp .:jsoup-1.17.2.jar KindnessScraper
```

The web app reads its pins from the Lovable Cloud `kindness_pins` table (already
seeded with 30 curated stories). To push scraped rows into the live map, insert
the JSON entries into that table with `source = 'seed'`.
