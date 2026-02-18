import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, Award, Home } from "lucide-react";
import { AptitudeTestResult } from "@/lib/aptitudeQuestions";
import { aptitudeQuestions } from "@/lib/aptitudeQuestions";

const AptitudeResult = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<AptitudeTestResult | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedResult = sessionStorage.getItem("aptitudeTestResult");
    if (savedResult) {
      const parsedResult: AptitudeTestResult = JSON.parse(savedResult);
      setResult(parsedResult);
      
      // Animate progress circle
      setTimeout(() => {
        setProgress((parsedResult.score / parsedResult.totalQuestions) * 100);
      }, 300);
    } else {
      navigate("/aptitude-test");
    }
  }, [navigate]);

  if (!result) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </DashboardLayout>
    );
  }

  const percentage = (result.score / result.totalQuestions) * 100;
  const performanceLevel =
    percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : percentage >= 40 ? "Average" : "Needs Improvement";
  const performanceColor =
    percentage >= 80 ? "text-success" : percentage >= 60 ? "text-primary" : percentage >= 40 ? "text-warning" : "text-destructive";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Your Aptitude Test Result</h1>
                <p className="text-sm text-muted-foreground">Performance Summary</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Score Card with Circular Progress */}
          <Card className="p-8 border-2 border-border mb-6 text-center">
            <div className="flex flex-col items-center">
              {/* Circular Progress */}
              <div className="relative w-48 h-48 mb-6">
                <svg className="transform -rotate-90 w-48 h-48">
                  {/* Background circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-foreground">{result.score}</span>
                  <span className="text-xl text-muted-foreground">/ {result.totalQuestions}</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-2">
                {result.score} out of {result.totalQuestions}
              </h2>
              <Badge className={`${performanceColor} text-lg px-4 py-1 mb-4`} variant="outline">
                {performanceLevel}
              </Badge>
              <p className="text-muted-foreground">You scored {percentage.toFixed(0)}%</p>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="p-6 border-2 border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                  <p className="text-2xl font-bold text-foreground">{result.score}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wrong Answers</p>
                  <p className="text-2xl font-bold text-foreground">
                    {result.totalQuestions - result.score}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Taken</p>
                  <p className="text-2xl font-bold text-foreground">{result.timeTaken}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Answer Summary */}
          <Card className="p-6 border-2 border-border mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Answer Summary</h3>
            <div className="space-y-4">
              {aptitudeQuestions.map((question, index) => {
                const userAnswer = result.selectedAnswers.find((a) => a.questionId === question.id);
                const isCorrect = userAnswer ? userAnswer.selectedOption.trim() === question.answer.trim() : false;
                const wasAnswered = !!userAnswer;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? "border-success/50 bg-success/5"
                        : wasAnswered
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-muted bg-muted/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : wasAnswered ? (
                          <XCircle className="w-5 h-5 text-destructive" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-1 text-sm">
                          {wasAnswered ? (
                            <>
                              <p className="text-muted-foreground">
                                <span className="font-semibold">Your answer:</span>{" "}
                                <span className={isCorrect ? "text-success" : "text-destructive"}>
                                  {userAnswer.selectedOption}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-muted-foreground">
                                  <span className="font-semibold">Correct answer:</span>{" "}
                                  <span className="text-success">{question.answer}</span>
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-muted-foreground">
                              <span className="font-semibold text-warning">Not answered</span>
                              {" - "}
                              <span className="font-semibold">Correct answer:</span>{" "}
                              <span className="text-success">{question.answer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="px-8"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => {
                sessionStorage.removeItem("aptitudeTestResult");
                navigate("/aptitude-test");
              }}
              className="bg-gradient-primary hover:opacity-90 text-white px-8"
            >
              Retake Test
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AptitudeResult;
