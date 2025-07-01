
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
            "1ère Année": { name: "1ère Année", isActive: true, courses: [{ name: 'Mathématiques', hours: 4 }, { name: 'Français', hours: 4 }, { name: 'Anglais', hours: 3 }] },
            "2ème Année": { name: "2ème Année", isActive: true, courses: [{ name: 'Mathématiques', hours: 4 }, { name: 'Français', hours: 4 }, { name: 'Physique', hours: 3 }] },
        }
    },
    "Humanités": {
      options: {
        "Latin-Grec": {
          classes: {
            "3ème Latin-Grec": { name: "3ème Latin-Grec", isActive: true, courses: [{ name: 'Latin', hours: 4 }, { name: 'Grec', hours: 4 }] },
            "4ème Latin-Grec": { name: "4ème Latin-Grec", isActive: true, courses: [{ name: 'Latin', hours: 4 }, { name: 'Grec', hours: 4 }] },
            "5ème Latin-Grec": { name: "5ème Latin-Grec", isActive: true, courses: [{ name: 'Latin', hours: 4 }, { name: 'Grec', hours: 4 }] },
            "6ème Latin-Grec": { name: "6ème Latin-Grec", isActive: true, courses: [{ name: 'Latin', hours: 4 }, { name: 'Grec', hours: 4 }] },
          }
        },
        "Électricité": {
          classes: {
            "3ème Électricité": { name: "3ème Électricité", isActive: true, courses: [{ name: 'Électricité Générale', hours: 6 }] },
            "4ème Électricité": { name: "4ème Électricité", isActive: true, courses: [{ name: 'Mesures Électriques', hours: 6 }] },
            "5ème Électricité": { name: "5ème Électricité", isActive: false, courses: [] },
            "6ème Électricité": { name: "6ème Électricité", isActive: true, courses: [{ name: 'Électronique Appliquée', hours: 6 }] },
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
            return Object.keys(schoolStructure.Secondaire.Humanités.options[option]?.classes || {});
        }
    }
    return [];
};

export const getCoursesForLevel = (level?: string) => {
    if (!level) return [];
    const courses = new Set<string>();

    const extractCourses = (classObj: any) => {
        classObj.courses.forEach((c: any) => courses.add(c.name));
    }
    
    if (level === 'Maternelle') {
        Object.values(schoolStructure.Maternelle.classes).forEach(extractCourses);
    }
    if (level === 'Primaire') {
        Object.values(schoolStructure.Primaire.classes).forEach(extractCourses);
    }
    if (level === 'Secondaire') {
        Object.values(schoolStructure.Secondaire["Éducation de base"].classes).forEach(extractCourses);
        Object.values(schoolStructure.Secondaire.Humanités.options).forEach(opt => {
             Object.values(opt.classes).forEach(extractCourses);
        });
    }

    return Array.from(courses);
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
        Object.values(optionInfo.classes).forEach(classInfo => {
            if (classInfo.isActive) {
                classInfo.courses.forEach(course => {
                    flatList.push({ ...course, className: classInfo.name, level: 'Secondaire', status: 'Actif', section: 'Humanités', option: optionName });
                });
            }
        });
    });

    return flatList;
};
