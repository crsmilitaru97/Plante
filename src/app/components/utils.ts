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

export const marimi = ['Foarte mică', 'Mică', 'Medie', 'Mare', 'Foarte mare'];
export const culori = ["#FFFFFF", "#000000", "#FF0000", "#008000", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#808080", "#800000", "#808000", "#000080",
  "#800080", "#008080", "#C0C0C0", "#00FF00", "#00FFFF", "#FF00FF", "#FFA500", "#A52A2A", "#FFC0CB", "#FFD700", "#F5F5DC", "#FF7F50", "#40E0D0"
];
export const organe = [{ label: 'Floare', value: "floare" }, { label: 'Fruct', value: "fruct" }, { label: 'Frunză', value: "frunză" }, { label: 'Tulpină', value: "tulpină" }];
