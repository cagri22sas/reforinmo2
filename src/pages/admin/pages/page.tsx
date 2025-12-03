import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { PlusIcon, EditIcon, Trash2Icon } from "lucide-react";
import AdminLayout from "@/components/AdminLayout.tsx";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface PageFormData {
  slug: string;
  title: string;
  metaDescription: string;
  published: boolean;
  language: "en" | "es";
}

function PageDialog({ 
  page, 
  onClose 
}: { 
  page?: {
    _id: Id<"pages">;
    slug: string;
    title: string;
    content: string;
    metaDescription?: string;
    published: boolean;
    language: "en" | "es";
  }; 
  onClose: () => void;
}) {
  const createPage = useMutation(api.admin.pages.create);
  const updatePage = useMutation(api.admin.pages.update);

  const [formData, setFormData] = useState<PageFormData>({
    slug: page?.slug || "",
    title: page?.title || "",
    metaDescription: page?.metaDescription || "",
    published: page?.published ?? true,
    language: page?.language || "en",
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: page?.content || "<p>Start writing your page content...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none min-h-[300px] focus:outline-none border rounded-md p-4 bg-background",
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editor) {
      toast.error("Editor not ready");
      return;
    }

    if (!formData.slug || !formData.title) {
      toast.error("Title and slug are required");
      return;
    }

    try {
      const data = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        content: editor.getHTML(),
        metaDescription: formData.metaDescription?.trim() || undefined,
        published: formData.published,
        language: formData.language,
      };

      if (page) {
        await updatePage({ id: page._id, ...data });
        toast.success("Page updated successfully");
      } else {
        await createPage(data);
        toast.success("Page created successfully");
      }

      editor.commands.clearContent();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save page");
      }
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Page Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <div className="flex gap-2">
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              required
              placeholder="about-us"
            />
            <Button type="button" onClick={generateSlug} variant="outline" size="sm">
              Generate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">URL: /{formData.slug || "page-slug"}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Input
          id="metaDescription"
          value={formData.metaDescription}
          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          placeholder="Brief description for SEO"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language *</Label>
        <Select 
          value={formData.language} 
          onValueChange={(value) => setFormData({ ...formData, language: value as "en" | "es" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Content *</Label>
        <div className="border rounded-lg">
          <div className="border-b bg-muted/30 p-2 flex gap-1 flex-wrap">
            <Button
              type="button"
              size="sm"
              variant={editor?.isActive("bold") ? "default" : "ghost"}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              Bold
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editor?.isActive("italic") ? "default" : "ghost"}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              Italic
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editor?.isActive("heading", { level: 2 }) ? "default" : "ghost"}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editor?.isActive("heading", { level: 3 }) ? "default" : "ghost"}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editor?.isActive("bulletList") ? "default" : "ghost"}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              List
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editor?.isActive("orderedList") ? "default" : "ghost"}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              Numbered
            </Button>
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
        />
        <Label htmlFor="published">Published</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {page ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}

type Page = {
  _id: Id<"pages">;
  _creationTime: number;
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  published: boolean;
  language: "en" | "es";
};

function PagesContent() {
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es" | "all">("all");
  const pages = useQuery(
    api.admin.pages.list, 
    selectedLanguage === "all" ? {} : { language: selectedLanguage }
  );
  const deletePage = useMutation(api.admin.pages.remove);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | undefined>(undefined);

  if (pages === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const handleDelete = async (id: Id<"pages">) => {
    if (confirm("Are you sure you want to delete this page?")) {
      try {
        await deletePage({ id });
        toast.success("Page deleted");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred");
        }
      }
    }
  };

  const openCreateDialog = () => {
    setEditingPage(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (page: Page) => {
    setEditingPage(page);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPage(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">
            Manage static pages like Privacy Policy, Terms, About Us
          </p>
        </div>

        <div className="flex gap-3">
          <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as "en" | "es" | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Page
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? "Edit Page" : "Create New Page"}
              </DialogTitle>
            </DialogHeader>
            <PageDialog page={editingPage} onClose={closeDialog} />
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No pages yet. Create your first page!
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page._id}>
                  <TableCell>
                    <p className="font-medium">{page.title}</p>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">/{page.slug}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {page.language === "en" ? "🇬🇧 EN" : "🇪🇸 ES"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {page.published ? (
                      <Badge>Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(page)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(page._id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default function AdminPagesPage() {
  return (
    <AdminLayout>
      <Unauthenticated>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Please sign in to access this page
              </p>
              <SignInButton />
            </div>
          </CardContent>
        </Card>
      </Unauthenticated>

      <AuthLoading>
        <Skeleton className="h-96 w-full" />
      </AuthLoading>

      <Authenticated>
        <PagesContent />
      </Authenticated>
    </AdminLayout>
  );
}
