import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { aptitudeQuestions, AptitudeTestResult } from "@/lib/aptitudeQuestions";

const AptitudeTest = () => {
  const navigate = useNavigate();
  
  // Test states
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ questionId: number; selectedOption: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes in seconds
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!testStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleEndTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTest = () => {
    setShowGuidelines(false);
    setTestStarted(true);
    setStartTime(new Date());
    toast.success("Test started! Good luck!");
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) {
      toast.error("Please select an answer before proceeding");
      return;
    }

    // Save the answer
    const updatedAnswers = [
      ...selectedAnswers.filter((a) => a.questionId !== aptitudeQuestions[currentQuestionIndex].id),
      {
        questionId: aptitudeQuestions[currentQuestionIndex].id,
        selectedOption: selectedOption,
      },
    ];
    setSelectedAnswers(updatedAnswers);
    setSelectedOption("");

    // Move to next question or end test
    if (currentQuestionIndex < aptitudeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Check if next question was already answered
      const nextAnswer = updatedAnswers.find(
        (a) => a.questionId === aptitudeQuestions[currentQuestionIndex + 1].id
      );
      if (nextAnswer) {
        setSelectedOption(nextAnswer.selectedOption);
      }
    } else {
      // All questions answered
      handleEndTest();
    }
  };

  const handleEndTest = () => {
    // Save current answer if one is selected
    let finalAnswers = [...selectedAnswers];
    if (selectedOption) {
      finalAnswers = [
        ...selectedAnswers.filter((a) => a.questionId !== aptitudeQuestions[currentQuestionIndex].id),
        {
          questionId: aptitudeQuestions[currentQuestionIndex].id,
          selectedOption: selectedOption,
        },
      ];
    }

    const endTime = new Date();
    const timeTaken = startTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;

    // Calculate score
    let score = 0;
    const results = finalAnswers.map((answer) => {
      const question = aptitudeQuestions.find((q) => q.id === answer.questionId);
      if (question && question.answer === answer.selectedOption) {
        score++;
      }
      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        correctAnswer: question?.answer || "",
      };
    });

    const testResult: AptitudeTestResult = {
      score,
      totalQuestions: aptitudeQuestions.length,
      selectedAnswers: results,
      startTime: startTime!,
      endTime,
      timeTaken: formatTime(timeTaken),
    };

    // Save to session storage
    sessionStorage.setItem("aptitudeTestResult", JSON.stringify(testResult));
    
    toast.success("Test completed!");
    navigate("/aptitude-result");
  };

  const currentQuestion = aptitudeQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / aptitudeQuestions.length) * 100;

  if (showGuidelines) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full p-8 border-2 border-border">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Aptitude Round</h1>
              <p className="text-muted-foreground">Answer 10 questions within 20 minutes</p>
            </div>

            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Guidelines:</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Total questions: <span className="font-semibold text-foreground">10</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Time limit: <span className="font-semibold text-foreground">20 minutes</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Each question carries <span className="font-semibold text-foreground">1 mark</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">No negative marking</p>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Do not refresh the page during the test</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Test auto-submits when timer ends</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleStartTest}
              className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-6 text-lg"
            >
              I Understand, Start Test
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!testStarted) return null;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header with Timer */}
        <div className="border-b border-border bg-card sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Aptitude Test</h2>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {aptitudeQuestions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant={timeRemaining < 300 ? "destructive" : "outline"}
                className="text-lg px-4 py-2 font-mono"
              >
                <Clock className="w-4 h-4 mr-2" />
                {formatTime(timeRemaining)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-muted">
          <div className="max-w-5xl mx-auto px-6 py-2">
            <div className="w-full bg-muted-foreground/20 rounded-full h-2">
              <div
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Card className="p-8 border-2 border-border mb-6">
            <div className="mb-6">
              <Badge variant="outline" className="mb-4">
                Question {currentQuestionIndex + 1}
              </Badge>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedOption === option
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedOption === option && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-base text-foreground font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <Button
              onClick={handleEndTest}
              variant="outline"
              className="text-destructive hover:text-destructive border-destructive/50"
            >
              End Test
            </Button>

            <Button
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className="bg-gradient-primary hover:opacity-90 text-white px-8"
            >
              {currentQuestionIndex === aptitudeQuestions.length - 1 ? "Finish Test" : "Next Question"}
            </Button>
          </div>

          {/* Question Navigator */}
          <div className="mt-8 p-6 bg-card rounded-lg border border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">Question Navigator</h4>
            <div className="flex flex-wrap gap-2">
              {aptitudeQuestions.map((_, index) => {
                const isAnswered = selectedAnswers.some(
                  (a) => a.questionId === aptitudeQuestions[index].id
                );
                const isCurrent = index === currentQuestionIndex;
                return (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
                      isCurrent
                        ? "bg-primary text-white"
                        : isAnswered
                        ? "bg-success/20 text-success border-2 border-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AptitudeTest;
