

export const schoolStructure = {
  "Maternelle": {
    classes: {
      "1ère Maternelle": {
        name: "1ère Maternelle",
        isActive: true,
        courses: [
          { name: "Psychomotricité", hours: 3, professeur: 'Mme. Kanza', room: 'Salle Polyvalente', description: '', domain: 'Développement Personnel', maxima: { p1: 10, p2: 10, exam: 20 } },
          { name: "Éveil Artistique", hours: 2, professeur: 'Mme. Kanza', room: 'Atelier 1', description: '', domain: 'Arts', maxima: { p1: 10, p2: 10, exam: 20 } },
          { name: "Langage", hours: 4, professeur: 'Mme. Kanza', room: 'Salle 1', description: '', domain: 'Langues', maxima: { p1: 10, p2: 10, exam: 20 } },
        ]
      },
       "2ème Maternelle": {
        name: "2ème Maternelle",
        isActive: true,
        courses: [
          { name: "Graphisme", hours: 3, professeur: 'Mme. Kanza', room: 'Atelier 1', description: '', domain: 'Arts', maxima: { p1: 10, p2: 10, exam: 20 } },
          { name: "Découverte du Monde", hours: 3, professeur: 'Mme. Kanza', room: 'Salle 2', description: '', domain: 'Univers Social et Environnement', maxima: { p1: 10, p2: 10, exam: 20 } },
          { name: "Pré-lecture", hours: 4, professeur: 'Mme. Kanza', room: 'Salle 2', description: '', domain: 'Langues', maxima: { p1: 10, p2: 10, exam: 20 } },
        ]
      },
    }
  },
  "Primaire": {
    classes: {
      "6ème Primaire": { 
          name: "6ème Primaire", 
          isActive: true, 
          courses: [
              { name: 'Français', hours: 4, professeur: 'M. Hugo', room: 'Salle 102', description: '', domain: 'Langues', maxima: { p1: 20, p2: 20, exam: 40 } },
              { name: 'Mathématiques', hours: 4, professeur: 'M. Dupont', room: 'Salle 101', description: '', domain: 'Sciences', subDomain: 'Mathématiques', maxima: { p1: 20, p2: 20, exam: 40 } },
              { name: 'Géographie', hours: 2, professeur: 'M. Kabila', room: 'Salle 103', description: '', domain: 'Univers Social et Environnement', maxima: { p1: 10, p2: 10, exam: 20 } }
          ] 
      },
    }
  },
  "Secondaire": {
    "Éducation de base": {
        classes: {
            "7ème Année": { 
                name: "7ème Année", 
                isActive: true, 
                courses: [
                    { name: 'Algèbre', hours: 2, professeur: 'M. Dupont', room: 'Salle 201', description: '', domain: 'Sciences', subDomain: 'Mathématiques', maxima: { p1: 10, p2: 10, exam: 20 } },
                    { name: 'Arithmétique', hours: 2, professeur: 'M. Dupont', room: 'Salle 201', description: '', domain: 'Sciences', subDomain: 'Mathématiques', maxima: { p1: 10, p2: 10, exam: 20 } },
                    { name: 'Anatomie', hours: 2, professeur: 'Mme. Curie', room: 'Labo 1', description: '', domain: 'Sciences', subDomain: 'Sciences de la Vie et de la Terre (SVT)', maxima: { p1: 10, p2: 10, exam: 20 } },
                    { name: 'Français', hours: 4, professeur: 'M. Hugo', room: 'Salle 202', description: '', domain: 'Langues', maxima: { p1: 30, p2: 30, exam: 40 } },
                    { name: 'Anglais', hours: 3, professeur: 'Mme. Diallo', room: 'Salle 203', description: '', domain: 'Langues', maxima: { p1: 15, p2: 15, exam: 20 } },
                    { name: 'Histoire', hours: 2, professeur: 'M. Kabila', room: 'Salle 202', description: '', domain: 'Univers Social et Environnement', maxima: { p1: 10, p2: 10, exam: 20 } },
                ] 
            },
        }
    },
    "Humanités": {
      options: {}
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
    
    let courses: any[] = [];

    // Check Maternelle
    // @ts-ignore
    if (schoolStructure.Maternelle.classes[className]) {
        // @ts-ignore
        courses = schoolStructure.Maternelle.classes[className].courses;
    }
    
    // Check Primaire
    // @ts-ignore
    else if (schoolStructure.Primaire.classes[className]) {
        // @ts-ignore
        courses = schoolStructure.Primaire.classes[className].courses;
    }

    // Check Secondaire - Éducation de base
    // @ts-ignore
    else if (schoolStructure.Secondaire['Éducation de base'].classes[className]) {
        // @ts-ignore
        courses = schoolStructure.Secondaire['Éducation de base'].classes[className].courses;
    }
    
    // Check Secondaire - Humanités
    else {
        for (const option of Object.values(schoolStructure.Secondaire.Humanités.options)) {
            // @ts-ignore
            if (option.classes[className]) {
                // @ts-ignore
                courses = option.classes[className].courses;
                break;
            }
        }
    }
    
    return courses.map(c => c.name);
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
