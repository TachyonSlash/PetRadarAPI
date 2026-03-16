import { envs } from "src/config/envs";


export const generateMatchMapboxStaticImage = (
    lostLat: number,
    lostLon: number,
    foundLat: number,
    foundLon: number,
    ): string => {
    const accessToken = envs.MAPBOX_TOKEN;
    const width = 800;
    const height = 400;

    return `
            https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s-l+e63946(${lostLon},${lostLat}),pin-s-f+2a9d8f(${foundLon},${foundLat})/auto/${width}x${height}?padding=80&access_token=${accessToken}
            `.trim();
};