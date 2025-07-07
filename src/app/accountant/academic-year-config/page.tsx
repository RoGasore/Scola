"use client";

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AcademicYearConfig, Fee } from "@/types/accounting";
import { getAcademicYearConfig, saveAcademicYearConfig } from "@/services/accounting";
import { getClasses } from "@/services/academic"; // Assuming a service to get classes
import { Class } from "@/types"; // Assuming a type for Class

interface FeesConfig {
  [className: string]: Fee[];
}

const AcademicYearConfigPage: React.FC = () => {
  const [academicYear, setAcademicYear] = useState<string>('');
  const [years, setYears] = useState<string[]>([]); // State to store available academic years
  const [tuitionFees, setTuitionFees] = useState<FeesConfig>({});
  const [otherFees, setOtherFees] = useState<FeesConfig>({});
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch available academic years (you might need a service for this)
      // For now, let's mock some years
      setYears(['2022-2023', '2023-2024', '2024-2025', '2025-2026']);

      // Fetch classes
      const fetchedClasses = await getClasses();
      setClasses(fetchedClasses);

      setLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      if (academicYear) {
        setLoading(true);
        const config = await getAcademicYearConfig(academicYear);
        if (config) {
          setTuitionFees(config.tuitionFees || {});
          setOtherFees(config.otherFees || {});
        } else {
          // If no config exists, initialize with default structure
 initializeFeesForClasses(fetchedClasses);
        }
        setLoading(false);
      }
    };

 const initializeFeesForClasses = (classes: Class[]) => {
 const initialTuitionFees: FeesConfig = {};
          const initialOtherFees: FeesConfig = {};
          classes.forEach(cls => {
            initialTuitionFees[cls.id] = [{ type: 'tuition', name: 'Trimestre 1', amount: 0 }, { type: 'tuition', name: 'Trimestre 2', amount: 0 }, { type: 'tuition', name: 'Trimestre 3', amount: 0 }];
            initialOtherFees[cls.id] = []; // Initialize with no other fees
          });
          setTuitionFees(initialTuitionFees);
        setLoading(false);
      }
    };
    fetchConfig();
  }, [academicYear, classes]);

  const handleYearChange = (value: string) => {
    setAcademicYear(value);
  };

  const handleCopyConfig = async (fromYear: string) => {
      setLoading(true);
      const configToCopy = await getAcademicYearConfig(fromYear);
      // Filter out the current year from the copy from options
      const availableCopyYears = years.filter(year => year !== academicYear);
      if (configToCopy) {
        setTuitionFees(configToCopy.tuitionFees || {});
        setOtherFees(configToCopy.otherFees || {});
      }
      setLoading(false);
    }
  };

  const handleTuitionFeeChange = (className: string, feeIndex: number, field: keyof Fee, value: any) => {
    setTuitionFees(prevFees => ({
      ...prevFees,
      [className]: prevFees[className].map((fee, index) =>
        index === feeIndex ? { ...fee, [field]: value } : fee
      ),
    }));
  };

  const handleOtherFeeChange = (className: string, feeIndex: number, field: keyof Fee, value: any) => {
    setOtherFees(prevFees => ({
      ...prevFees,
      [className]: prevFees[className].map((fee, index) =>
        index === feeIndex ? { ...fee, [field]: value } : fee
      ),
    }));
  };

  const handleAddOtherFee = (className: string) => {
    setOtherFees(prevFees => ({
      ...prevFees,
      [className]: [...prevFees[className], { type: 'other', name: '', amount: 0 }],
    }));
  };

  const handleRemoveOtherFee = (className: string, feeIndex: number) => {
    setOtherFees(prevFees => ({
      ...prevFees,
      [className]: prevFees[className].filter((_, index) => index !== feeIndex),
    }));
  };


  const handleSaveConfig = async () => {
    if (academicYear) {
      setSaving(true);
      const config: AcademicYearConfig = {
        academicYear,
        tuitionFees,
        otherFees,
      };
      await saveAcademicYearConfig(config);
      setSaving(false);
      alert('Configuration saved successfully!');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Configuration de l'Année Académique</h1>

      <div className="mb-6 flex items-center space-x-4">
        <label htmlFor="academicYear" className="text-lg font-medium">Année Académique:</label>
        <Select onValueChange={handleYearChange} value={academicYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner l'année" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {academicYear && (
          <div className="flex items-center space-x-2">
            <label htmlFor="copyFromYear" className="text-lg font-medium">Copier depuis:</label>
            <Select onValueChange={handleCopyConfig}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner l'année" />
              </SelectTrigger>
              <SelectContent>
                {years.filter(year => year !== academicYear).map(year => ( // Ensure we don't show the current year as a copy option
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {academicYear && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Frais de Scolarité par Classe et Trimestre</h2>
          {classes.map(cls => (
            <div key={cls.id} className="mb-6 border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">{cls.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tuitionFees[cls.id]?.map((fee, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <label className="w-24">{fee.name}:</label>
                    <Input
                      type="number"
                      value={fee.amount}
                      onChange={(e) => handleTuitionFeeChange(cls.id, index, 'amount', parseFloat(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <h2 className="text-xl font-semibold mb-4 mt-8">Autres Frais par Classe</h2>
          {classes.map(cls => (
            <div key={cls.id} className="mb-6 border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">{cls.name}</h3>
              {otherFees[cls.id]?.map((fee, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Nom du frais"
                    value={fee.name}
                    onChange={(e) => handleOtherFeeChange(cls.id, index, 'name', e.target.value)}
                    className="w-40"
                  />
                  <Input
                    type="number"
                    placeholder="Montant"
                    value={fee.amount}
                    onChange={(e) => handleOtherFeeChange(cls.id, index, 'amount', parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveOtherFee(cls.id, index)}>Supprimer</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => handleAddOtherFee(cls.id)}>Ajouter un autre frais</Button>
            </div>
          ))}

          <Button onClick={handleSaveConfig} disabled={saving}>
            {saving ? 'Sauvegarde en cours...' : 'Sauvegarder la Configuration'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AcademicYearConfigPage;