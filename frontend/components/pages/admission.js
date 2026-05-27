"use client";

// Admission form page (client-side): handles form state and file uploads.
// Notes:
// - Uses shadcn form primitives in `components/ui/*`
// - Sends FormData to the Django API (backend) via `lib/api`.
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";

const GRADE_OPTIONS = [
  { value: "K", label: "Kindergarten" },
  ...Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: `Grade ${index + 1}` })),
];

const ACTIVITY_LIST = ["Chess", "Carom", "Cricket", "Swimming", "Dancing", "Singing", "Football"];

export default function AdmissionFormPage() {
  // Local form state is stored in `formData`.
  // imageFile and documentFile hold File objects for FormData uploads.
  const [formData, setFormData] = useState({ applicant_name: "", grade_level: "", gender: "M", activity_names: [] });
  const [imageFile, setImageFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

  const updateField = (field, value) => setFormData((current) => ({ ...current, [field]: value }));
  const handleActivityToggle = (activity, checked) => updateField("activity_names", checked ? [...formData.activity_names, activity] : formData.activity_names.filter((item) => item !== activity));
  const handleImageChange = (event) => { const file = event.target.files?.[0]; if (!file) return; setImageFile(file); setImagePreview(URL.createObjectURL(file)); };
  const handleDocumentChange = (event) => setDocumentFile(event.target.files?.[0] || null);

  // Submit handler: builds FormData and posts to backend.
  const handleSubmit = async (event) => {
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    // Submit directly to backend.
    setLoading(true);
    setMessage("");
    const payload = new FormData();
    payload.append("applicant_name", formData.applicant_name);
    payload.append("grade_level", formData.grade_level);
    payload.append("gender", formData.gender);
    formData.activity_names.forEach((activity) => payload.append("activity_names", activity));
    if (imageFile) payload.append("image", imageFile);
    if (documentFile) payload.append("document", documentFile);

    try {
      await api.post("/applications/", payload);
      setMessage("Application submitted successfully.");
      setFormData({ applicant_name: "", grade_level: "", gender: "M", activity_names: [] });
      setImageFile(null); setDocumentFile(null); setImagePreview("");
    } catch (error) {
      console.error("Submission failed:", error);
      setMessage("Submission failed. Try again or check details and submit again.");
    } finally { setLoading(false); }
  };

  // Form submits directly; no intermediate confirmation step.

  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8fafc_44%,#eef2ff_100%)] px-4 py-10 text-[#1f2937] md:px-8">
      <div className="w-full max-w-3xl">
        <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(30,58,138,0.10)] md:p-8">
          <div className="space-y-2"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">School Online Admission</p>
            <h1 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">Admission Form</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">Submit student information, pick extracurricular interests, and upload supporting files.</p>
          </div>

          <Card className="border-slate-200 shadow-none"><CardHeader><CardTitle className="text-xl text-primary">Student Details</CardTitle><CardDescription>Fields map directly to the Django API.</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2"><Label htmlFor="applicant_name">Applicant Name</Label><Input id="applicant_name" value={formData.applicant_name} onChange={(e) => updateField("applicant_name", e.target.value)} placeholder="Jane Doe" required /></div>

                <div className="space-y-2"><Label htmlFor="grade_level">Grade Level</Label>
                  <Select value={formData.grade_level} onValueChange={(value) => updateField("grade_level", value)}>
                    <SelectTrigger id="grade_level"><SelectValue placeholder="Select grade level" /></SelectTrigger>
                    <SelectContent>{GRADE_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div className="space-y-2"><Label>Gender</Label>
                  <RadioGroup value={formData.gender} onValueChange={(value) => updateField("gender", value)} className="grid gap-3 sm:grid-cols-2">
                    {[{ value: "M", label: "Male" }, { value: "F", label: "Female" }].map((option) => (
                      <label key={option.value} htmlFor={`gender-${option.value}`} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-accent hover:bg-amber-50/60">
                        <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3"><Label>Activities</Label><div className="grid gap-3 sm:grid-cols-2">{ACTIVITY_LIST.map((activity) => (
                  <label key={activity} htmlFor={activity} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-accent hover:bg-amber-50/60">
                    <Checkbox id={activity} checked={formData.activity_names.includes(activity)} onCheckedChange={(checked) => handleActivityToggle(activity, checked === true)} />
                    <span className="text-sm font-medium text-foreground">{activity}</span>
                  </label>
                ))}</div></div>

                <div className="space-y-2"><Label htmlFor="image">Student Photo</Label><Input id="image" type="file" accept="image/*" onChange={handleImageChange} />{imagePreview ? <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-secondary"><img src={imagePreview} alt="Selected preview" className="h-52 w-full object-cover" /></div> : null}</div>

                <div className="space-y-2"><Label htmlFor="document">Supporting Document</Label><Input id="document" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleDocumentChange} />{documentFile ? <p className="text-xs text-slate-500">Attached: {documentFile.name}</p> : null}</div>

                {message ? <div className="rounded-2xl border border-accent/30 bg-amber-50 px-4 py-3 text-sm text-foreground">{message}</div> : null}

                <Button type="submit" className="w-full rounded-2xl py-6 text-base" disabled={loading}>{loading ? "Submitting application..." : "Submit Admission Request"}</Button>
              </form>
            </CardContent></Card>
        </section>
      </div>
    </main>
  );
}
