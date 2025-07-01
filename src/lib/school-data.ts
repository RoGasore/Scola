
export const schoolStructure = {
  "Maternelle": {
    classes: {
      "1ère Maternelle": {
        name: "1ère Maternelle",
        isActive: true,
        courses: [
          { name: "Psychomotricité", hours: 3 },
          { name: "Éveil Artistique", hours: 2 },
          { name: "Langage", hours: 4 },
        ]
      },
      "2ème Maternelle": {
        name: "2ème Maternelle",
        isActive: true,
        courses: [
          { name: "Graphisme", hours: 3 },
          { name: "Découverte du Monde", hours: 3 },
          { name: "Pré-lecture", hours: 4 },
        ]
      },
      "3ème Maternelle": {
        name: "3ème Maternelle",
        isActive: true,
        courses: [
          { name: "Pré-écriture", hours: 4 },
          { name: "Pré-mathématiques", hours: 4 },
          { name: "Activités ludiques", hours: 2 },
        ]
      },
    }
  },
  "Primaire": {
    classes: {
      "1ère Primaire": { name: "1ère Primaire", isActive: true, courses: [{ name: 'Français', hours: 5 }, { name: 'Mathématiques', hours: 5 }] },
      "2ème Primaire": { name: "2ème Primaire", isActive: true, courses: [{ name: 'Français', hours: 5 }, { name: 'Mathématiques', hours: 5 }] },
      "3ème Primaire": { name: "3ème Primaire", isActive: true, courses: [{ name: 'Français', hours: 4 }, { name: 'Mathématiques', hours: 4 }, { name: 'Sciences', hours: 2 }] },
      "4ème Primaire": { name: "4ème Primaire", isActive: true, courses: [{ name: 'Français', hours: 4 }, { name: 'Mathématiques', hours: 4 }, { name: 'Sciences', hours: 2 }] },
      "5ème Primaire": { name: "5ème Primaire", isActive: true, courses: [{ name: 'Français', hours: 4 }, { name: 'Mathématiques', hours: 4 }, { name: 'Histoire', hours: 2 }] },
      "6ème Primaire": { name: "6ème Primaire", isActive: true, courses: [{ name: 'Français', hours: 4 }, { name: 'Mathématiques', hours: 4 }, { name: 'Géographie', hours: 2 }] },
    }
  },
  "Secondaire": {
    "Éducation de base": {
        classes: {
            "7ème Année": { name: "7ème Année", isActive: true, courses: [{ name: 'Mathématiques', hours: 4 }, { name: 'Français', hours: 4 }, { name: 'Anglais', hours: 3 }, { name: 'Histoire', hours: 2 }, { name: 'Géographie', hours: 2 }] },
            "8ème Année": { name: "8ème Année", isActive: true, courses: [{ name: 'Mathématiques', hours: 4 }, { name: 'Français', hours: 4 }, { name: 'Physique', hours: 3 }, { name: 'Chimie', hours: 2 }, { name: 'Biologie', hours: 2 }] },
        }
    },
    "Humanités": {
      options: {
        "Latin-Grec": {
          classes: {
            "1ère Latin-Grec": { name: "1ère Latin-Grec", isActive: true, courses: [{ name: 'Latin', hours: 4 }, { name: 'Grec', hours: 4 }, { name: 'Français', hours: 3 }] },
            "2ème Latin-Grec": { name: "2ème Latin-Grec", isActive: true, courses: [{ name: 'Latin', hours: 4 }, { name: 'Grec', hours: 4 }, { name: 'Philosophie', hours: 2 }] },
            "3ème Latin-Grec": { name: "3ème Latin-Grec", isActive: true, courses: [{ name: 'Latin', hours: 4 }, { name: 'Grec', hours: 4 }, { name: 'Histoire de l’art', hours: 2 }] },
            "4ème Latin-Grec": { name: "4ème Latin-Grec", isActive: true, courses: [{ name: 'Latin', hours: 4 }, { name: 'Grec', hours: 4 }, { name: 'Civilisation antique', hours: 2 }] },
          }
        },
        "Électricité": {
          classes: {
            "1ère Électricité": { name: "1ère Électricité", isActive: true, courses: [{ name: 'Électricité Générale', hours: 6 }, { name: 'Schémas', hours: 4 }] },
            "2ème Électricité": { name: "2ème Électricité", isActive: true, courses: [{ name: 'Mesures Électriques', hours: 6 }, { name: 'Technologie', hours: 4 }] },
            "3ème Électricité": { name: "3ème Électricité", isActive: false, courses: [] },
            "4ème Électricité": { name: "4ème Électricité", isActive: true, courses: [{ name: 'Électronique Appliquée', hours: 6 }, { name: 'Automatisme', hours: 4 }] },
          }
        },
        "Sciences Économiques": {
          classes: {
            "1ère Sciences Économiques": { name: "1ère Sciences Économiques", isActive: true, courses: [{ name: 'Économie Politique', hours: 4 }, { name: 'Comptabilité', hours: 4 }] },
            "2ème Sciences Économiques": { name: "2ème Sciences Économiques", isActive: true, courses: [{ name: 'Droit', hours: 3 }, { name: 'Comptabilité', hours: 4 }] },
            "3ème Sciences Économiques": { name: "3ème Sciences Économiques", isActive: true, courses: [{ name: 'Statistique', hours: 3 }, { name: 'Marketing', hours: 3 }] },
            "4ème Sciences Économiques": { name: "4ème Sciences Économiques", isActive: true, courses: [{ name: 'Gestion financière', hours: 4 }, { name: 'Économie internationale', hours: 2 }] },
          }
        },
        "Biochimie": {
          classes: {
            "1ère Biochimie": { name: "1ère Biochimie", isActive: true, courses: [{ name: 'Biologie', hours: 4 }, { name: 'Chimie générale', hours: 4 }] },
            "2ème Biochimie": { name: "2ème Biochimie", isActive: true, courses: [{ name: 'Chimie Organique', hours: 4 }, { name: 'Microbiologie', hours: 4 }] },
            "3ème Biochimie": { name: "3ème Biochimie", isActive: true, courses: [{ name: 'Biochimie', hours: 6 }, { name: 'Physique biologique', hours: 3 }] },
            "4ème Biochimie": { name: "4ème Biochimie", isActive: true, courses: [{ name: 'Génétique', hours: 4 }, { name: 'Immunologie', hours: 4 }] },
          }
        }
      }
    }
  }
};


// Helper functions to extract data for dropdowns
export const getLevels = () => Object.keys(schoolStructure);

export const getSectionsForSecondary = () => Object.keys(schoolStructure.Secondaire);

export const getOptionsForHumanites = () => Object.keys(schoolStructure.Secondaire.Humanités.options);

export const getClassesForLevel = (level?: string, section?: string, option?: string) => {
    if (!level || level === 'Tous') {
        const allClasses = [];
        allClasses.push(...Object.keys(schoolStructure.Maternelle.classes));
        allClasses.push(...Object.keys(schoolStructure.Primaire.classes));
        allClasses.push(...Object.keys(schoolStructure.Secondaire["Éducation de base"].classes));
        Object.values(schoolStructure.Secondaire.Humanités.options).forEach(opt => {
            allClasses.push(...Object.keys(opt.classes));
        });
        return [...new Set(allClasses)];
    }

    if (level === 'Maternelle') return Object.keys(schoolStructure.Maternelle.classes);
    if (level === 'Primaire') return Object.keys(schoolStructure.Primaire.classes);
    if (level === 'Secondaire') {
        if (!section || section === 'all') {
             const secondaryClasses = [];
             secondaryClasses.push(...Object.keys(schoolStructure.Secondaire["Éducation de base"].classes));
             Object.values(schoolStructure.Secondaire.Humanités.options).forEach(opt => {
                secondaryClasses.push(...Object.keys(opt.classes));
             });
             return [...new Set(secondaryClasses)];
        }
        if (section === 'Éducation de base') {
            return Object.keys(schoolStructure.Secondaire["Éducation de base"].classes);
        }
        if (section === 'Humanités') {
            if (!option || option === 'all') {
                const humanitesClasses: string[] = [];
                Object.values(schoolStructure.Secondaire.Humanités.options).forEach(opt => {
                    humanitesClasses.push(...Object.keys(opt.classes));
                });
                return [...new Set(humanitesClasses)];
            }
            // @ts-ignore
            return Object.keys(schoolStructure.Secondaire.Humanités.options[option]?.classes || {});
        }
    }
    return [];
};

export const getCoursesForClass = (className?: string): string[] => {
    if (!className) {
        return [];
    }
    
    // Check Maternelle
    // @ts-ignore
    if (schoolStructure.Maternelle.classes[className]) {
        // @ts-ignore
        return schoolStructure.Maternelle.classes[className].courses.map(c => c.name);
    }
    
    // Check Primaire
    // @ts-ignore
    if (schoolStructure.Primaire.classes[className]) {
        // @ts-ignore
        return schoolStructure.Primaire.classes[className].courses.map(c => c.name);
    }

    // Check Secondaire - Éducation de base
    // @ts-ignore
    if (schoolStructure.Secondaire['Éducation de base'].classes[className]) {
        // @ts-ignore
        return schoolStructure.Secondaire['Éducation de base'].classes[className].courses.map(c => c.name);
    }
    
    // Check Secondaire - Humanités
    for (const option of Object.values(schoolStructure.Secondaire.Humanités.options)) {
        // @ts-ignore
        if (option.classes[className]) {
            // @ts-ignore
            return option.classes[className].courses.map(c => c.name);
        }
    }
    
    return [];
};


// Helper to flatten the structure for table display
export const flattenStructureToCourses = (structure: typeof schoolStructure) => {
    const flatList: any[] = [];
    
    // Maternelle
    Object.values(structure.Maternelle.classes).forEach(classInfo => {
        if (classInfo.isActive) {
            classInfo.courses.forEach(course => {
                flatList.push({ ...course, className: classInfo.name, level: 'Maternelle', status: 'Actif', section: null, option: null });
            });
        }
    });

    // Primaire
    Object.values(structure.Primaire.classes).forEach(classInfo => {
        if (classInfo.isActive) {
            classInfo.courses.forEach(course => {
                flatList.push({ ...course, className: classInfo.name, level: 'Primaire', status: 'Actif', section: null, option: null });
            });
        }
    });

    // Secondaire - Éducation de base
    Object.values(structure.Secondaire['Éducation de base'].classes).forEach(classInfo => {
        if (classInfo.isActive) {
            classInfo.courses.forEach(course => {
                flatList.push({ ...course, className: classInfo.name, level: 'Secondaire', status: 'Actif', section: 'Éducation de base', option: null });
            });
        }
    });

    // Secondaire - Humanités
    Object.entries(structure.Secondaire.Humanités.options).forEach(([optionName, optionInfo]) => {
        // @ts-ignore
        Object.values(optionInfo.classes).forEach(classInfo => {
            if (classInfo.isActive) {
                // @ts-ignore
                classInfo.courses.forEach(course => {
                    flatList.push({ ...course, className: classInfo.name, level: 'Secondaire', status: 'Actif', section: 'Humanités', option: optionName });
                });
            }
        });
    });

    return flatList;
};
