"use client";

// Admin dashboard (client-side): list, filter, edit, and manage applications.
// Key behaviors:
// - Fetches application records via `lib/api`
// - Supports status updates, edits, and deletes via API calls
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const GRADE_OPTIONS = [ { value: "K", label: "Kindergarten" }, ...Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: `Grade ${index + 1}` })) ];

const ACTIVITY_LIST = ["Chess", "Carom", "Cricket", "Swimming", "Dancing", "Singing", "Football"];

const STATUS_OPTIONS = [ { value: "processing", label: "Processing" }, { value: "accepted", label: "Accepted" }, { value: "rejected", label: "Rejected" } ];

const STATUS_STYLES = { processing: "border-amber-300 bg-amber-50 text-amber-800", accepted: "border-emerald-300 bg-emerald-50 text-emerald-700", rejected: "border-rose-300 bg-rose-50 text-rose-700" };

const normalizeRecord = (record) => ({ ...record, activity_names: Array.isArray(record.activities) ? record.activities : [] });

export default function AdminDashboardPage() {
  // `records` holds normalized application objects returned from the backend.
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load records from backend and normalize shapes for UI use.
  const fetchApplications = async () => { setLoading(true); setError(""); try { const response = await api.get("/applications/"); setRecords(response.data.map(normalizeRecord)); } catch (requestError) { console.error("Error loading applications:", requestError); setError("Unable to load applications. Make sure Django is running on port 8000."); } finally { setLoading(false); } };

  useEffect(() => { fetchApplications(); }, []);

  const stats = useMemo(() => { const total = records.length; const processing = records.filter((r) => r.status === "processing").length; const accepted = records.filter((r) => r.status === "accepted").length; const rejected = records.filter((r) => r.status === "rejected").length; return { total, processing, accepted, rejected }; }, [records]);

  const handleStatusChange = async (id, nextStatus) => { try { await api.patch(`/applications/${id}/`, { status: nextStatus }); setRecords((current) => current.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))); } catch (requestError) { console.error("Status update failed:", requestError); setError("Status update failed. Check the backend connection and try again."); } };

  const handleDelete = async (id) => { if (!confirm("Delete this application permanently?")) return; try { await api.delete(`/applications/${id}/`); setRecords((current) => current.filter((r) => r.id !== id)); } catch (requestError) { console.error("Delete failed:", requestError); setError("Delete failed. Check the backend connection and try again."); } };

  const openEditDialog = (record) => { setEditingItem({ ...record, activity_names: Array.isArray(record.activity_names) ? record.activity_names : [] }); setIsDialogOpen(true); };
  const updateDraft = (field, value) => setEditingItem((c) => ({ ...c, [field]: value }));
  const toggleDraftActivity = (activity, checked) => setEditingItem((c) => { const currentActivities = Array.isArray(c.activity_names) ? c.activity_names : []; const next = checked ? [...currentActivities, activity] : currentActivities.filter((i) => i !== activity); return { ...c, activity_names: next }; });

  const handleEditSubmit = async () => { if (!editingItem) return; setSaving(true); try { const payload = { applicant_name: editingItem.applicant_name, grade_level: editingItem.grade_level, gender: editingItem.gender, activity_names: editingItem.activity_names }; const response = await api.patch(`/applications/${editingItem.id}/`, payload); const updated = normalizeRecord(response.data); setRecords((current) => current.map((r) => (r.id === editingItem.id ? updated : r))); setIsDialogOpen(false); setEditingItem(null); } catch (requestError) { console.error("Edit failed:", requestError); setError("Edit failed. Check the backend connection and try again."); } finally { setSaving(false); } };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8fafc_44%,#e5e7eb_100%)] px-4 py-8 text-[#1f2937] md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(30,58,138,0.10)] md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Administrative Monitoring Dashboard</p>
              <h1 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">System Master Dashboard</h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">Review applications, change status, edit details, and remove records from the admissions pipeline.</p>
            </div>
            <div className="flex gap-3"><Button variant="outline" onClick={fetchApplications} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</Button><Button asChild><a href="/admission">Open Form</a></Button></div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[
            { label: "Total Applications", value: stats.total }, { label: "Processing", value: stats.processing }, { label: "Accepted", value: stats.accepted }, { label: "Rejected", value: stats.rejected },
          ].map((item) => (
            <Card key={item.label} className="border-slate-200 bg-white text-foreground shadow-none"><CardHeader className="space-y-1 p-5 pb-2"><CardDescription className="text-muted-foreground">{item.label}</CardDescription><CardTitle className="text-3xl text-primary">{item.value}</CardTitle></CardHeader></Card>
          ))}</div>

          {error ? <div className="mt-5 rounded-2xl border border-accent/30 bg-amber-50 px-4 py-3 text-sm text-foreground">{error}</div> : null}
        </section>

        <Card className="border-slate-200 bg-white text-foreground shadow-[0_20px_80px_rgba(30,58,138,0.10)]"><CardContent className="p-0"><Table>
            <TableHeader><TableRow className="border-slate-200 hover:bg-slate-50"><TableHead className="text-foreground">Applicant Name</TableHead><TableHead className="text-foreground">Grade Placement</TableHead><TableHead className="text-foreground">Gender</TableHead><TableHead className="text-foreground">Interests</TableHead><TableHead className="text-foreground">Status</TableHead><TableHead className="text-right text-foreground">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {loading ? <TableRow className="border-slate-200 hover:bg-slate-50"><TableCell colSpan={6} className="py-12 text-center text-muted-foreground">Loading applications...</TableCell></TableRow> : records.length === 0 ? <TableRow className="border-slate-200 hover:bg-slate-50"><TableCell colSpan={6} className="py-12 text-center text-muted-foreground">No data registered in database.</TableCell></TableRow> : records.map((record) => (
                <TableRow key={record.id} className="border-slate-200 hover:bg-slate-50"><TableCell className="font-semibold text-foreground">{record.applicant_name}</TableCell><TableCell className="text-muted-foreground">{GRADE_OPTIONS.find((item) => item.value === record.grade_level)?.label || record.grade_level}</TableCell><TableCell className="text-muted-foreground">{record.gender === "M" ? "Male" : record.gender === "F" ? "Female" : record.gender}</TableCell><TableCell className="max-w-65 text-muted-foreground">{record.activities?.length ? <div className="flex flex-wrap gap-2">{record.activities.map((activity) => <span key={activity} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-foreground">{activity}</span>)}</div> : "None"}</TableCell>
                    <TableCell><Select value={record.status} onValueChange={(value) => handleStatusChange(record.id, value)}><SelectTrigger className={`w-37.5 border-slate-200 bg-white text-foreground ${STATUS_STYLES[record.status] || ""}`}><SelectValue /></SelectTrigger><SelectContent>{STATUS_OPTIONS.map((statusOption) => <SelectItem key={statusOption.value} value={statusOption.value}>{statusOption.label}</SelectItem>)}</SelectContent></Select></TableCell>
                    <TableCell className="space-x-2 text-right"><Button variant="outline" size="sm" onClick={() => openEditDialog(record)}>Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>Delete</Button></TableCell></TableRow>
              ))}
            </TableBody>
          </Table></CardContent></Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Modify Applicant Registry</DialogTitle></DialogHeader>
        {editingItem ? <div className="space-y-4 py-2"><div className="space-y-2"><Label htmlFor="edit-applicant-name">Applicant Name</Label><Input id="edit-applicant-name" value={editingItem.applicant_name || ""} onChange={(e) => updateDraft("applicant_name", e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="edit-grade-level">Grade Level</Label><Select value={editingItem.grade_level || ""} onValueChange={(value) => updateDraft("grade_level", value)}><SelectTrigger id="edit-grade-level"><SelectValue placeholder="Select grade level" /></SelectTrigger><SelectContent>{GRADE_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Gender</Label><Select value={editingItem.gender || "M"} onValueChange={(value) => updateDraft("gender", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="M">Male</SelectItem><SelectItem value="F">Female</SelectItem></SelectContent></Select></div>
          <div className="space-y-3"><Label>Extracurricular Activities</Label><div className="grid gap-3 sm:grid-cols-2">{ACTIVITY_LIST.map((activity) => <label key={activity} htmlFor={`edit-${activity}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-3 hover:border-accent"><Checkbox id={`edit-${activity}`} checked={editingItem.activity_names.includes(activity)} onCheckedChange={(checked) => toggleDraftActivity(activity, checked === true)} /><span className="text-sm font-medium">{activity}</span></label>)}</div></div></div> : null}
        <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={handleEditSubmit} disabled={saving}>{saving ? "Saving..." : "Save Modifications"}</Button></DialogFooter>
      </DialogContent></Dialog>
    </main>
  );
}
