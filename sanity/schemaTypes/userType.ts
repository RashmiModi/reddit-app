import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "username",
      title: "Username",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(50),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "imageUrl",
      title: "Image URL",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: false }),
    }),
    defineField({
      name: "joinedAt",
      title: "Joined At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isReported",
      title: "Is Reported",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'username',
      media: 'imageUrl',
    },
    prepare({ title, media }) {
      return {
        title: title || 'No title',
        subtitle: media || 'No image',
        media: UserIcon,
      };
    },
  },
});
