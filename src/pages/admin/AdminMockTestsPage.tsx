import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteMockTest, getCompanies, getManagedMockTests, upsertMockTest } from "@/lib/adminData";
import type { MockTest, MockTestQuestion } from "@/data/mockTests";

const emptyTest: MockTest = {
  id: "",
  company: "",
  title: "",
  durationMinutes: 30,
  released: true,
  questions: [],
};

const emptyQuestion = (company = "test", index = 1): MockTestQuestion => ({
  id: `${company || "test"}-q-${index}`,
  prompt: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  section: "Aptitude",
});

const AdminMockTestsPage = () => {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [companyOptions, setCompanyOptions] = useState<string[]>([]);
  const [form, setForm] = useState<MockTest>(emptyTest);

  useEffect(() => {
    setTests(getManagedMockTests());
    setCompanyOptions(getCompanies().map((item) => item.name.includes("(") ? item.name.split(" (")[0] : item.name));
  }, []);

  const updateQuestion = (index: number, patch: Partial<MockTestQuestion>) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question
      ),
    }));
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, currentQuestionIndex) =>
        currentQuestionIndex === questionIndex
          ? {
              ...question,
              options: question.options.map((option, currentOptionIndex) =>
                currentOptionIndex === optionIndex ? value : option
              ),
            }
          : question
      ),
    }));
  };

  const addQuestion = () => {
    setForm((current) => ({
      ...current,
      questions: [...current.questions, emptyQuestion(current.company || "test", current.questions.length + 1)],
    }));
  };

  const removeQuestion = (index: number) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.filter((_, questionIndex) => questionIndex !== index),
    }));
  };

  const saveTest = () => {
    if (!form.company.trim() || !form.title.trim()) {
      toast.error("Company and title are required.");
      return;
    }
    const payload: MockTest = {
      ...form,
      questions: form.questions
        .map((question, index) => ({
          ...question,
          id: `${form.company || "test"}-q-${index + 1}`,
          prompt: question.prompt.trim(),
          options: question.options.map((option) => option.trim()).filter(Boolean),
          correctAnswer: question.correctAnswer.trim(),
        }))
        .filter((question) => question.prompt && question.options.length > 0 && question.correctAnswer),
    };

    if (payload.questions.length === 0) {
      toast.error("Add at least one complete question before saving the mock test.");
      return;
    }

    setTests(upsertMockTest(payload));
    setForm(emptyTest);
    window.dispatchEvent(new CustomEvent("hirelytics:mock-tests-updated"));
    toast.success(payload.released ? "Mock test saved and released to students." : "Mock test saved as draft.");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto section-padding py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Mock Test Management</h1>
          <p className="text-muted-foreground">Create or edit tests and control whether they are released to students.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px,1fr]">
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
              <Select value={form.company} onValueChange={(value) => setForm({ ...form, company: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Test title</label>
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Duration (mins)</label>
                <Input type="number" placeholder="Duration" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Release status</label>
                <Select value={String(form.released)} onValueChange={(value) => setForm({ ...form, released: value === "true" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Released</SelectItem>
                    <SelectItem value="false">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Questions</label>
                <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                  Add Question
                </Button>
              </div>
              <div className="space-y-3">
                {form.questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No questions added yet.</p>
                ) : (
                  form.questions.map((question, index) => (
                    <div key={`${form.id || "new-test"}-${index}`} className="rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">Question {index + 1}</p>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeQuestion(index)}>
                          Remove
                        </Button>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Prompt</label>
                        <Input
                          placeholder="Question text"
                          value={question.prompt}
                          onChange={(e) => updateQuestion(index, { prompt: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Section</label>
                        <Select
                          value={question.section}
                          onValueChange={(value) => updateQuestion(index, { section: value as "Aptitude" | "MCQ" })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Aptitude">Aptitude</SelectItem>
                            <SelectItem value="MCQ">MCQ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                              Option {String.fromCharCode(65 + optionIndex)}
                            </label>
                            <Input
                              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                              value={option}
                              onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Correct answer</label>
                        <Input
                          placeholder="Enter the exact correct option text"
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveTest}>{form.id ? "Update Test" : "Create Test"}</Button>
              <Button variant="outline" onClick={() => setForm(emptyTest)}>Reset</Button>
            </div>
          </section>

          <section className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{test.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{test.company} · {test.durationMinutes} mins · {test.released ? "Released" : "Draft"}</p>
                    <p className="text-xs text-muted-foreground mt-2">{test.questions.length} questions</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setForm(test)}>Edit</Button>
                    <Button variant="outline" onClick={() => { setTests(deleteMockTest(test.id)); window.dispatchEvent(new CustomEvent("hirelytics:mock-tests-updated")); toast.success("Mock test deleted."); }}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminMockTestsPage;
