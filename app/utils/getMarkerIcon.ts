// utils/getMarkerIcon.ts
export const getMarkerIcon = (picture: string) => {
    // Check if the picture is not empty
    if (picture) {
        // Check if the URL is not an absolute URL
        if (!/^http/i.test(picture)) {
            // Prepend the marker icon path
            picture = `/images/marker_icons/${picture}`;
        }

        // Change extension to .png if not already
        if (!picture.endsWith('.png')) {
            picture = picture.replace(/\.(jpg|jpeg)$/, '.png');
        }
    }
    return picture;
};
