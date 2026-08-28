import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Echoes of Kindness — standalone Reddit scraper.
 *
 * Pulls top post titles from kindness subreddits (via old.reddit.com HTML),
 * assigns each entry a randomized global coordinate, and writes
 * ../public/seed_data.json which the frontend can consume on load.
 *
 * Build & run:
 *   javac -cp jsoup-1.17.2.jar KindnessScraper.java
 *   java  -cp .:jsoup-1.17.2.jar KindnessScraper
 */
public class KindnessScraper {

    private static final String[] SUBREDDITS = {"MadeMeSmile", "HumansBeingBros", "UpliftingNews"};
    private static final int PER_SUB = 15;
    private static final String USER_AGENT =
            "Mozilla/5.0 (compatible; EchoesOfKindnessBot/1.0; +https://echoes-of-kindness.lovable.app)";

    // Populated city anchors so random pins land on land, not mid-ocean.
    private static final double[][] ANCHORS = {
            {40.7128, -74.0060}, {51.5074, -0.1278}, {35.6762, 139.6503}, {-33.8688, 151.2093},
            {-23.5505, -46.6333}, {19.0760, 72.8777}, {6.5244, 3.3792}, {52.5200, 13.4050},
            {-1.2921, 36.8219}, {19.4326, -99.1332}, {31.2304, 121.4737}, {55.7558, 37.6173},
            {-34.6037, -58.3816}, {41.0082, 28.9784}, {1.3521, 103.8198}, {45.5017, -73.5673}
    };

    record Story(String text, String source, double lat, double lng) {}

    public static void main(String[] args) throws IOException {
        Random random = new Random(42);
        List<Story> stories = new ArrayList<>();

        for (String sub : SUBREDDITS) {
            String url = "https://old.reddit.com/r/" + sub + "/top/?t=year";
            try {
                Document doc = Jsoup.connect(url)
                        .userAgent(USER_AGENT)
                        .timeout(15000)
                        .get();

                Elements titles = doc.select("p.title > a.title");
                int taken = 0;
                for (Element title : titles) {
                    if (taken >= PER_SUB) break;
                    String text = title.text().trim();
                    if (text.length() < 25 || text.length() > 300) continue;

                    double[] anchor = ANCHORS[random.nextInt(ANCHORS.length)];
                    double lat = clamp(anchor[0] + (random.nextDouble() - 0.5) * 8, -85, 85);
                    double lng = wrap(anchor[1] + (random.nextDouble() - 0.5) * 8);

                    stories.add(new Story(text, "r/" + sub, round(lat), round(lng)));
                    taken++;
                }
                System.out.println("Scraped " + taken + " titles from r/" + sub);
            } catch (IOException e) {
                System.err.println("Failed to scrape r/" + sub + ": " + e.getMessage());
            }
        }

        writeJson(stories, "../public/seed_data.json");
        System.out.println("Wrote " + stories.size() + " stories to ../public/seed_data.json");
    }

    private static void writeJson(List<Story> stories, String path) throws IOException {
        StringBuilder sb = new StringBuilder("[\n");
        for (int i = 0; i < stories.size(); i++) {
            Story s = stories.get(i);
            sb.append("  {\"story\": \"").append(escape(s.text()))
              .append("\", \"location_name\": \"").append(escape(s.source()))
              .append("\", \"lat\": ").append(s.lat())
              .append(", \"lng\": ").append(s.lng())
              .append(", \"source\": \"seed\"}");
            sb.append(i < stories.size() - 1 ? ",\n" : "\n");
        }
        sb.append("]\n");
        try (FileWriter writer = new FileWriter(path)) {
            writer.write(sb.toString());
        }
    }

    private static String escape(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ");
    }

    private static double clamp(double v, double min, double max) {
        return Math.max(min, Math.min(max, v));
    }

    private static double wrap(double lng) {
        double x = lng;
        while (x > 180) x -= 360;
        while (x < -180) x += 360;
        return x;
    }

    private static double round(double v) {
        return Math.round(v * 10000.0) / 10000.0;
    }
}
