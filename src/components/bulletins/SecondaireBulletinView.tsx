
'use client'

import React, { useEffect, useState } from 'react';
import type { BulletinData } from '@/types';
import { Separator } from '../ui/separator';
import { getSecondaireBulletinDataForStudent } from '@/services/bulletins';
import { Skeleton } from '../ui/skeleton';

const BulletinSkeleton = () => (
    <div className="p-4 border rounded-lg space-y-6 bg-white">
        <div className="flex justify-between items-start">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-48" />
        </div>
        <div className="text-center">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-5 w-1/2 mx-auto mt-2" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
        </div>
        <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-8 w-1/4" />
                </div>
            ))}
        </div>
    </div>
);

type BulletinViewProps = {
    studentId: string;
    termId: string;
}

export function SecondaireBulletinView({ studentId, termId }: BulletinViewProps) {
    const [bulletinData, setBulletinData] = useState<BulletinData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!studentId || !termId) return;

        async function fetchData() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getSecondaireBulletinDataForStudent(studentId, termId);
                if (!data) {
                    throw new Error("Impossible de générer les données du bulletin pour cet élève.");
                }
                setBulletinData(data);
                
            } catch (e: any) {
                console.error(e);
                setError(e.message || "Une erreur est survenue lors du chargement des données du bulletin.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [studentId, termId]);

    if (isLoading) return <BulletinSkeleton />;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
    if (!bulletinData) return null;

    const { student, term, domains, grandTotals, percentage } = bulletinData;
    const year = new Date(term.startDate).getFullYear();

    const Cell = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => <td className={`border border-black p-1 text-center text-xs ${className}`}>{children}</td>;
    const HeadCell = ({ children, className = '', ...props }: { children?: React.ReactNode, className?: string, [key: string]: any }) => <th className={`border border-black p-1 font-bold text-xs ${className}`} {...props}>{children}</th>;
    const BranchCell = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => <td className={`border border-black p-1 text-left text-xs ${className}`}>{children}</td>;
    const EmptyCell = ({ colSpan = 1 }) => <td colSpan={colSpan} className="border border-black p-1 h-5"></td>;
    
    return (
        <div className="bg-white text-black font-sans p-4" style={{ width: '210mm', minHeight: '297mm', margin: 'auto' }}>
            <header className="flex justify-between items-center mb-2">
                <div className="w-1/4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg/1200px-Flag_of_the_Democratic_Republic_of_the_Congo.svg.png" alt="Drapeau RDC" className="h-12"/>
                </div>
                <div className="w-1/2 text-center">
                    <p className="font-bold text-sm">REPUBLIQUE DEMOCRATIQUE DU CONGO</p>
                    <p className="font-semibold text-xs">MINISTERE DE L'ENSEIGNEMENT PRIMAIRE, SECONDAIRE</p>
                    <p className="font-semibold text-xs">ET PROFESSIONNEL</p>
                </div>
                <div className="w-1/4 flex justify-end">
                    <img src="https://seeklogo.com/images/M/ministere-de-l-education-nationale-de-la-jeunesse-et-des-sports-logo-812CH38890-seeklogo.com.png" alt="Logo Ministère" className="h-16"/>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-x-4 border-y-2 border-black py-1 text-xs mb-2">
                <div>
                    <p>PROVINCE: <strong>KINSHASA</strong></p>
                    <p>VILLE: <strong>KINSHASA</strong></p>
                    <p>COMMUNE/TER: <strong>GOMBE</strong></p>
                    <p>ECOLE: <strong>LYCEE BANA</strong></p>
                    <p>CODE: <strong>12345</strong></p>
                </div>
                <div className="text-right">
                    <p>ELEVE: <strong>{student.lastName} {student.firstName}</strong></p>
                    <p>NE(E) A: <strong>{student.pob}</strong> &nbsp; Le: <strong>{new Date(student.dob).toLocaleDateString('fr-FR')}</strong></p>
                    <p>CLASSE: <strong>{student.classe}</strong></p>
                    <p>N° PERM.: <strong>{student.matricule}</strong></p>
                </div>
            </div>

            <h3 className="text-center font-bold text-sm border-2 border-black p-1 mb-2">
                BULLETIN DE LA {student.classe.split(' ')[0]} ANNEE CYCLE TERMINAL DE L'EDUCATION DE BASE (CTBE) ANNEE SCOLAIRE {year} - {year + 1}
            </h3>

            <table className="w-full border-collapse border border-black">
                <thead>
                    <tr className="bg-gray-200">
                        <HeadCell rowSpan={3}>BRANCHE</HeadCell>
                        <HeadCell colSpan={5}>PREMIER SEMESTRE</HeadCell>
                        <HeadCell colSpan={5}>SECOND SEMESTRE</HeadCell>
                        <HeadCell rowSpan={3}>T.G.</HeadCell>
                        <HeadCell colSpan={2}>EXAMEN DE REPECHAGE</HeadCell>
                    </tr>
                    <tr className="bg-gray-200">
                        <HeadCell colSpan={3}>TRAVAUX JOURNAL.</HeadCell>
                        <HeadCell rowSpan={2}>MAX</HeadCell>
                        <HeadCell rowSpan={2}>TOT</HeadCell>
                        <HeadCell colSpan={3}>TRAVAUX JOURNAL.</HeadCell>
                        <HeadCell rowSpan={2}>MAX</HeadCell>
                        <HeadCell rowSpan={2}>TOT</HeadCell>
                        <HeadCell rowSpan={2}>%</HeadCell>
                        <HeadCell rowSpan={2}>Sign. Prof</HeadCell>
                    </tr>
                    <tr className="bg-gray-200">
                        <HeadCell>1ère P</HeadCell>
                        <HeadCell>2ème P</HeadCell>
                        <HeadCell>EXAMEN</HeadCell>
                        <HeadCell>3ème P</HeadCell>
                        <HeadCell>4ème P</HeadCell>
                        <HeadCell>EXAMEN</HeadCell>
                    </tr>
                </thead>
                <tbody>
                    {domains.map((domain, dIndex) => (
                        <React.Fragment key={dIndex}>
                            <tr className="bg-gray-100 font-bold"><td colSpan={14} className="border border-black p-1 text-center text-xs">DOMAINE {domain.name.toUpperCase()}</td></tr>
                            {domain.subDomains.map((subDomain, sdIndex) => (
                                <React.Fragment key={sdIndex}>
                                    {subDomain.name !== 'default' && <tr className="bg-gray-50 font-semibold"><td colSpan={14} className="border border-black p-1 text-left text-xs pl-4">Sous-domaine {subDomain.name}</td></tr>}
                                    {subDomain.courses.map((course, cIndex) => (
                                        <tr key={cIndex}>
                                            <BranchCell>{course.name}</BranchCell>
                                            <Cell>{course.grades.s1.p1?.grade.split('/')[0]}</Cell>
                                            <Cell>{course.grades.s1.p2?.grade.split('/')[0]}</Cell>
                                            <Cell>{course.grades.s1.exam?.grade.split('/')[0]}</Cell>
                                            <Cell>{course.maxima.p1 * 2 + course.maxima.exam}</Cell><Cell>{course.totals.s1}</Cell>
                                            
                                            <Cell>{course.grades.s2.p1?.grade.split('/')[0]}</Cell>
                                            <Cell>{course.grades.s2.p2?.grade.split('/')[0]}</Cell>
                                            <Cell>{course.grades.s2.exam?.grade.split('/')[0]}</Cell>
                                            <Cell>{course.maxima.p1 * 2 + course.maxima.exam}</Cell><Cell>{course.totals.s2}</Cell>
                                            
                                            <Cell>{course.totals.tg}</Cell>
                                            <EmptyCell /><EmptyCell />
                                        </tr>
                                    ))}
                                    <tr className="font-bold bg-gray-100">
                                        <BranchCell>SOUS-TOTAL</BranchCell>
                                        <td colSpan={3} className="border border-black"></td>
                                        <Cell>{subDomain.totals.maxima.s1}</Cell><Cell>{subDomain.totals.student.s1}</Cell>
                                        <td colSpan={3} className="border border-black"></td>
                                        <Cell>{subDomain.totals.maxima.s2}</Cell><Cell>{subDomain.totals.student.s2}</Cell>
                                        <Cell>{subDomain.totals.student.tg}</Cell>
                                        <EmptyCell colSpan={2} />
                                    </tr>
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                    <tr className="font-bold bg-gray-200">
                        <BranchCell>MAXIMA GENERAUX</BranchCell>
                        <td colSpan={3} className="border border-black"></td>
                        <Cell>{grandTotals.maxima.s1}</Cell><Cell>{grandTotals.maxima.s1}</Cell>
                        <td colSpan={3} className="border border-black"></td>
                        <Cell>{grandTotals.maxima.s2}</Cell><Cell>{grandTotals.maxima.s2}</Cell>
                        <Cell>{grandTotals.maxima.tg}</Cell>
                        <EmptyCell colSpan={2} />
                    </tr>
                     <tr className="font-bold">
                        <BranchCell>TOTAUX</BranchCell>
                        <td colSpan={4} className="border border-black"></td>
                        <Cell>{grandTotals.student.s1}</Cell>
                        <td colSpan={4} className="border border-black"></td>
                        <Cell>{grandTotals.student.s2}</Cell>
                        <Cell>{grandTotals.student.tg}</Cell>
                        <EmptyCell colSpan={2} />
                    </tr>
                    <tr><BranchCell>POURCENTAGE</BranchCell><EmptyCell colSpan={4} /><Cell>{(grandTotals.student.s1 / grandTotals.maxima.s1 * 100).toFixed(1)}%</Cell><EmptyCell colSpan={4} /><Cell>{(grandTotals.student.s2 / grandTotals.maxima.s2 * 100).toFixed(1)}%</Cell><Cell>{percentage}</Cell><EmptyCell colSpan={2} /></tr>
                    <tr><BranchCell>PLACE/NBRE D'ELEVES</BranchCell><EmptyCell colSpan={13} /></tr>
                    <tr><BranchCell>APPLICATION</BranchCell><EmptyCell colSpan={13} /></tr>
                    <tr><BranchCell>CONDUITE</BranchCell><EmptyCell colSpan={13} /></tr>
                </tbody>
            </table>

            <footer className="mt-4 text-xs space-y-2">
                <p>L'élève ne pourra passer dans la classe supérieure s'il n'a subi avec succès un examen de repêchage en ................................................................(1)</p>
                <p>L'élève passe dans la classe supérieure (1)</p>
                <p>L'élève double la classe (1)</p>
                <div className="flex justify-between items-end mt-4">
                    <p>Signature de l'élève</p>
                    <p>Fait à ......................., Le {new Date().toLocaleDateString('fr-FR')}</p>
                    <p>Le Chef d'Etablissement</p>
                </div>
                 <div className="flex justify-between items-end mt-12">
                    <p>.......................................</p>
                    <div><p>Sceau de l'école</p></div>
                    <p>.......................................</p>
                </div>
                <Separator className="my-4 bg-black"/>
                <p>(1) Biffer la mention inutile</p>
                <p>Note importante: Le Bulletin est sans valeur s'il est raturé ou surchargé</p>
            </footer>
        </div>
    );
}

    