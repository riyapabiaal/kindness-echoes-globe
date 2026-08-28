CREATE TABLE public.kindness_pins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story text NOT NULL CHECK (char_length(story) BETWEEN 5 AND 500),
  location_name text NOT NULL DEFAULT 'Somewhere on Earth' CHECK (char_length(location_name) <= 120),
  author_name text CHECK (author_name IS NULL OR char_length(author_name) <= 60),
  lat double precision NOT NULL CHECK (lat BETWEEN -90 AND 90),
  lng double precision NOT NULL CHECK (lng BETWEEN -180 AND 180),
  source text NOT NULL DEFAULT 'community' CHECK (source IN ('seed','community')),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.kindness_pins TO anon;
GRANT SELECT, INSERT ON public.kindness_pins TO authenticated;
GRANT ALL ON public.kindness_pins TO service_role;

ALTER TABLE public.kindness_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view kindness pins"
  ON public.kindness_pins FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can add a kindness pin"
  ON public.kindness_pins FOR INSERT
  TO anon, authenticated
  WITH CHECK (source = 'community');

INSERT INTO public.kindness_pins (story, location_name, author_name, lat, lng, source) VALUES
('A stranger paid for my groceries when my card declined, then walked away before I could thank him.', 'Toronto, Canada', 'Amara', 43.6532, -79.3832, 'seed'),
('A taxi driver drove me 20 minutes out of his way to a hospital and refused to take any money.', 'Lagos, Nigeria', 'Tunde', 6.5244, 3.3792, 'seed'),
('During a downpour, a shopkeeper handed out free umbrellas to everyone waiting at the bus stop.', 'Tokyo, Japan', NULL, 35.6762, 139.6503, 'seed'),
('A teenager gave up his seat and then quietly carried an elderly woman''s bags up three flights of stairs.', 'Naples, Italy', 'Giulia', 40.8518, 14.2681, 'seed'),
('Neighbours secretly repainted a widow''s fence overnight as a birthday surprise.', 'Melbourne, Australia', 'Pete', -37.8136, 144.9631, 'seed'),
('A barista wrote encouraging notes on every cup during exam week. Mine said: you are almost there.', 'Berlin, Germany', NULL, 52.52, 13.405, 'seed'),
('A bus full of commuters helped push a stalled car off a busy intersection in the rain.', 'São Paulo, Brazil', 'Ricardo', -23.5505, -46.6333, 'seed'),
('A stranger found my lost wallet and mailed it back with all the cash still inside and a kind letter.', 'Reykjavik, Iceland', NULL, 64.1466, -21.9426, 'seed'),
('The whole street cooked meals for a family after their home flooded. Nobody asked for credit.', 'Kerala, India', 'Meera', 10.8505, 76.2711, 'seed'),
('A man spent his lunch break teaching a nervous new driver how to parallel park.', 'Cape Town, South Africa', NULL, -33.9249, 18.4241, 'seed'),
('A cafe owner quietly lets students study for hours and refills their tea for free.', 'Istanbul, Türkiye', 'Elif', 41.0082, 28.9784, 'seed'),
('A cyclist stopped to fix a stranger''s flat tyre and left before she could offer money.', 'Amsterdam, Netherlands', NULL, 52.3676, 4.9041, 'seed'),
('Fishermen turned back from their catch to tow a broken-down boat safely to shore.', 'Cebu, Philippines', 'Marlon', 10.3157, 123.8854, 'seed'),
('A librarian saved a rare book for a kid who visited every week but could never afford it, then gifted it.', 'Buenos Aires, Argentina', NULL, -34.6037, -58.3816, 'seed'),
('Someone shovelled the snow off my entire block''s driveways before sunrise. Still no idea who.', 'Oslo, Norway', 'Ingrid', 59.9139, 10.7522, 'seed'),
('A construction crew built a wheelchair ramp for a neighbour on their weekend off.', 'Austin, United States', NULL, 30.2672, -97.7431, 'seed'),
('A young woman sat with a lost tourist for an hour until his family found him.', 'Seoul, South Korea', 'Jisoo', 37.5665, 126.978, 'seed'),
('Market sellers each donated one item so a struggling mother could fill her basket.', 'Marrakesh, Morocco', NULL, 31.6295, -7.9811, 'seed'),
('A stranger noticed I was crying on the train and handed me a chocolate bar and a tissue.', 'London, United Kingdom', 'Sam', 51.5074, -0.1278, 'seed'),
('Villagers carried an injured hiker four kilometres down the mountain on a makeshift stretcher.', 'Pokhara, Nepal', NULL, 28.2096, 83.9856, 'seed'),
('A bakery leaves its unsold bread in a basket outside every night, free for anyone who needs it.', 'Lisbon, Portugal', 'Rui', 38.7223, -9.1393, 'seed'),
('My landlord waived a month''s rent when I lost my job, and never once mentioned it again.', 'Mexico City, Mexico', NULL, 19.4326, -99.1332, 'seed'),
('A group of teenagers cleaned an entire beach after a festival without being asked.', 'Bali, Indonesia', 'Wayan', -8.4095, 115.1889, 'seed'),
('A nurse stayed three hours past her shift so a patient wouldn''t be alone overnight.', 'Warsaw, Poland', NULL, 52.2297, 21.0122, 'seed'),
('A truck driver stopped traffic on the highway to walk a family of ducks across.', 'Calgary, Canada', 'Dana', 51.0447, -114.0719, 'seed'),
('Someone paid off the entire layaway list at a small toy shop before the holidays.', 'Dublin, Ireland', NULL, 53.3498, -6.2603, 'seed'),
('A stranger gave me his jacket at a freezing bus stop and got on the next bus in a t-shirt.', 'Moscow, Russia', 'Nikita', 55.7558, 37.6173, 'seed'),
('Office workers pooled money to send the cleaning staff''s daughter to university.', 'Nairobi, Kenya', NULL, -1.2921, 36.8219, 'seed'),
('An old man waters every unclaimed plant on our apartment block, quietly, every morning.', 'Hanoi, Vietnam', 'Linh', 21.0278, 105.8342, 'seed'),
('A surf instructor gave free lessons all summer to kids who couldn''t pay a cent.', 'Sydney, Australia', NULL, -33.8688, 151.2093, 'seed');