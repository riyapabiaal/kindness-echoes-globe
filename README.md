# Echoes of Kindness Globe

i would like to create a project for my build-a-thon, and the idea that would like to implement is:

The "Echoes of Kindness" Map A live, interactive 3D globe where users drop a glowinggolden pin to describe a random act of kindness they witnessed or received in that exact spot. Over time, the map lights up with human goodness. Visually, a glowing globe on a live URL is an incredible demo piece.

i want a live URL with public access. and I dont want the judges to look at an empty globe but i also want the data to be real. so we can quickly 

spin up a standalone Java web scraper utilizing a library like Jsoup to pull the top post titles from subreddits like r/MadeMeSmile or r/HumansBeingBros. You can parse the text, assign randomized global coordinates to each entry, and output a clean JSON file that your frontend consumes on load.

So basically, build a single-page web application utilizing a 3D interactive globe library like React Globe GL or Three.js. The globe should be dark and elegant.

First, generate a seed_data.json file containing 30 realistic, heartwarming short stories about random acts of kindness, each with diverse global latitude and longitude coordinates.

Map this JSON data to the globe so that each entry appears as a glowing point of light. When I click or hover over a light, a clean, modern tooltip or modal should display the story. Finally, add a prominent 'Drop a Pin' button that opens a form for users to add their own story.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kindness-echoes-globe.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7d16cb8e-77ce-4c0a-a0df-292a80610b8a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
