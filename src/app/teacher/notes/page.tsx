
import { CreateEvaluationWizard } from "@/components/teacher/create-evaluation-wizard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewEvaluationPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Nouvelle Évaluation</CardTitle>
                    <CardDescription>
                        Suivez les étapes pour enregistrer une nouvelle évaluation et saisir les notes de vos élèves.
                    </CardDescription>
                </CardHeader>
                <CreateEvaluationWizard />
            </Card>
        </div>
    );
}
