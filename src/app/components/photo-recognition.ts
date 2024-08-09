import { fetchImage } from "./utils";

export async function getAverageColor(imageUrl: string): Promise<{ r: number, g: number, b: number }> {
  const img = new Image();
  img.src = imageUrl;

  const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(new Error(`Image failed to load: ${error}`));
  });

  try {
    await imageLoadPromise;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let r = 0, g = 0, b = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    return {
      r: Math.round(r / pixelCount),
      g: Math.round(g / pixelCount),
      b: Math.round(b / pixelCount)
    };
  } catch (error) {
    console.error('Error calculating average color:', error);
    return { r: 0, g: 0, b: 0 };
  }
}

export async function compareImages(referenceSrc: string, plants: any[]): Promise<{ src: string, difference: number }[]> {
  const referenceImg = await fetchImage(referenceSrc);
  if (!referenceImg) {
    console.error('Reference image failed to load.');
    return [];
  }

  const referenceAvgColor = await getAverageColor(referenceImg);
  const results: any[] = [];

  for (const plant of plants) {
    if (!plant.downloadedImage) {
      continue;
    }
    const avgColor = await getAverageColor(plant.downloadedImage);
    const difference = Math.floor(colorDifference(referenceAvgColor, avgColor));
    if (difference < 30) {
      results.push({ plant, difference });
    }
  }

  results.sort((a, b) => a.difference - b.difference);
  return results.slice(0, 8);
}

function colorDifference(color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }): number {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;

  // Calculate the Euclidean distance
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}
