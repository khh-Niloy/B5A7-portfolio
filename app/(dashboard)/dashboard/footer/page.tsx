"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface SocialLink {
  _id?: string;
  name: string;
  link: string;
  icon?: string;
}

interface FooterFormValues {
  socialLinks: SocialLink[];
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
  } = useForm<FooterFormValues>({
    defaultValues: {
      socialLinks: [{ name: "", link: "" }],
    },
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: "socialLinks",
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      setLoading(true);
      try {
        // const data = await getSocialLinks();
        // setSocialLinks(data || []);
        
        setSocialLinks([
          {
            _id: "1",
            name: "GitHub",
            link: "https://github.com/khh-Niloy",
          },
          {
            _id: "2", 
            name: "LinkedIn",
            link: "https://www.linkedin.com/in/hasibhossain-niloy01/",
          },
          {
            _id: "3",
            name: "Facebook", 
            link: "https://www.facebook.com/khhniloy.niloy/",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch social links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleCreate = () => {
    setIsEditing(false);
    setShowForm(true);
    reset({
      socialLinks: [{ name: "", link: "" }],
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowForm(true);
    reset({
      socialLinks: socialLinks.map(({ name, link }) => ({ name, link })),
    });
  };

  const onSubmit = async (data: FooterFormValues) => {
    try {
      const filteredLinks = data.socialLinks.filter(
        (link) => link.name.trim() !== "" && link.link.trim() !== ""
      );

      if (filteredLinks.length === 0) {
        toast.error("Please add at least one social link");
        return;
      }

      if (isEditing) {
        // await updateSocialLinks(filteredLinks);
        setSocialLinks(filteredLinks.map((link, index) => ({ ...link, _id: String(index + 1) })));
        toast.success("Social links updated successfully! 🔗");
      } else {
        // await createSocialLinks(filteredLinks);
        setSocialLinks(filteredLinks.map((link, index) => ({ ...link, _id: String(index + 1) })));
        toast.success("Social links created successfully! 🔗");
      }

      setShowForm(false);
      reset();
    } catch (error) {
      console.error("Failed to save social links:", error);
      toast.error("Failed to save social links");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    reset();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading social links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Footer & Social Links
          </h1>
          <p className="mt-2 text-gray-400">
            Manage your social media links and footer content.
          </p>
        </div>
        
        {!showForm && (
          <div className="flex gap-3">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit All
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Links
            </Button>
          </div>
        )}
      </div>

      {/* Social Links Form */}
      {showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isEditing ? "Edit Social Links" : "Add Social Links"}
            </h2>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {socialFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-end gap-4 p-4 border border-white/10 rounded-lg bg-white/5"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`}>Platform Name</Label>
                      <Input
                        id={`name-${index}`}
                        placeholder="e.g., GitHub, LinkedIn"
                        {...register(`socialLinks.${index}.name`)}
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`link-${index}`}>URL</Label>
                      <Input
                        id={`link-${index}`}
                        type="url"
                        placeholder="https://example.com"
                        {...register(`socialLinks.${index}.link`)}
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSocial(index)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    disabled={socialFields.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => appendSocial({ name: "", link: "" })}
                className="border-white/10 text-gray-300 hover:bg-white/5"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Link
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-white/10 text-gray-300 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all duration-200"
              >
                {isEditing ? "Update Links" : "Save Links"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Social Links List */}
      {!showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">
            Current Social Links ({socialLinks.length})
          </h2>

          {socialLinks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No social links configured yet.</p>
              <Button
                onClick={handleCreate}
                className="bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Link
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {socialLinks.map((social) => (
                <div
                  key={social._id}
                  className="border border-white/10 rounded-lg p-4 bg-white/5 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                        <span className="text-white font-medium text-sm">
                          {social.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold">
                          {social.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {social.link}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
