export function generateGuid() {
  return crypto.randomUUID().toString().replaceAll('-', '');
}

export function setAllOrgans(plantaSelectata: any) {
  organe.forEach(organ => {
    if (!plantaSelectata[organ.value]) {
      plantaSelectata[organ.value] = {
        culoare: null,
        marime: null,
        observatii: null
      };
    }
  });
}

export function resizeImage(imageURL: any, maxWidth = 240, maxHeight = 240): Promise<any> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function () {
      let width = image.width;
      let height = image.height;
      const aspectRatio = width / height;
      if (width > height) {
        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }
      } else {
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx != null) {
        ctx.drawImage(image, 0, 0, width, height);
      }
      const data = canvas.toDataURL('image/jpeg', 1);
      resolve(data);
    };
    image.onerror = function (error) {
      reject(error);
    };
    image.src = imageURL;
  });
}

export function b64toBlob(base64: string, contentType = '', sliceSize = 512): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}

export const marimi = ['Foarte mică', 'Mică', 'Medie', 'Mare', 'Foarte mare'];
export const culori = ["#FFFFFF", "#000000", "#FF0000", "#008000", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#808080", "#800000", "#808000", "#000080",
  "#800080", "#008080", "#C0C0C0", "#00FF00", "#00FFFF", "#FF00FF", "#FFA500", "#A52A2A", "#FFC0CB", "#FFD700", "#F5F5DC", "#FF7F50", "#40E0D0"
];
export const organe = [{ label: 'Floare', value: "floare" }, { label: 'Fruct', value: "fruct" }, { label: 'Frunză', value: "frunză" }, { label: 'Tulpină', value: "tulpină" }];
