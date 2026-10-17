#!/usr/bin/env node

/**
 * Non-destructive data migration script.
 * Imports existing projects from data/projects.json and inquiries from data/inquiries.json
 * into your dedicated Supabase PostgreSQL project.
 *
 * Usage:
 *   SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=ey... node scripts/import-to-supabase.js [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

const projectsFile = path.resolve(ROOT_DIR, "data/projects.json");
const inquiriesFile = path.resolve(ROOT_DIR, "data/inquiries.json");

const isDryRun = process.argv.includes("--dry-run");

async function runMigration() {
  console.log("=== Portfolio 2.0 Supabase Data Import Pipeline ===");
  if (isDryRun) {
    console.log("MODE: DRY RUN (No changes will be written to database)\n");
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error(
      "ERROR: Missing Supabase credentials.\n" +
        "Please provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as environment variables:\n\n" +
        "  SUPABASE_URL=https://your-project.supabase.co \\\n" +
        "  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \\\n" +
        "  node scripts/import-to-supabase.js [--dry-run]\n"
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Projects Migration
  console.log("1. Checking projects in data/projects.json...");
  if (!fs.existsSync(projectsFile)) {
    console.log("   No data/projects.json found. Skipping projects.");
  } else {
    try {
      const raw = fs.readFileSync(projectsFile, "utf-8");
      const projects = JSON.parse(raw);
      if (!Array.isArray(projects) || projects.length === 0) {
        console.log("   data/projects.json is empty. Zero projects to import.");
      } else {
        console.log(`   Found ${projects.length} project(s) to verify.`);

        let insertedCount = 0;
        let skippedCount = 0;

        for (const p of projects) {
          // Check if project exists by slug
          const { data: existing } = await supabase
            .from("projects")
            .select("id, slug")
            .eq("slug", p.slug)
            .maybeSingle();

          if (existing) {
            console.log(`   [SKIP] Project slug "${p.slug}" already exists in Supabase (id: ${existing.id}).`);
            skippedCount++;
            continue;
          }

          const row = {
            id: p.id || undefined,
            slug: p.slug,
            title: p.title,
            summary: p.summary,
            description: p.description ?? null,
            category: p.category ?? null,
            technologies: Array.isArray(p.technologies) ? p.technologies : [],
            project_type: p.projectType ?? null,
            role: p.role ?? null,
            timeline: p.timeline ?? null,
            problem: p.problem ?? null,
            objectives: p.objectives ?? null,
            approach: p.approach ?? null,
            implementation: p.implementation ?? null,
            outcomes: p.outcomes ?? null,
            cover_image_path: p.coverImagePath ?? null,
            cover_image_alt: p.coverImageAlt ?? null,
            gallery: Array.isArray(p.gallery) ? p.gallery.map((g) => ({ path: g.path, alt: g.alt })) : [],
            featured: Boolean(p.featured),
            sort_order: p.sortOrder || 0,
            status: p.status || "draft",
            published_at: p.status === "published" ? p.publishedAt || new Date().toISOString() : null,
            live_url: p.liveUrl ?? null,
            repository_url: p.repositoryUrl ?? null,
            seo_title: p.seoTitle ?? null,
            seo_description: p.seoDescription ?? null,
          };

          if (!isDryRun) {
            const { error: insertError } = await supabase.from("projects").insert(row);
            if (insertError) {
              console.error(`   [ERROR] Failed to insert project "${p.slug}": ${insertError.message}`);
            } else {
              console.log(`   [INSERTED] Project "${p.slug}" successfully migrated.`);
              insertedCount++;
            }
          } else {
            console.log(`   [DRY RUN] Would insert project "${p.slug}".`);
            insertedCount++;
          }
        }

        console.log(`   Projects Summary: ${insertedCount} imported, ${skippedCount} skipped.\n`);
      }
    } catch (err) {
      console.error("   Failed to read or parse data/projects.json:", err.message);
    }
  }

  // 2. Inquiries Migration
  console.log("2. Checking contact inquiries in data/inquiries.json...");
  if (!fs.existsSync(inquiriesFile)) {
    console.log("   No data/inquiries.json found. Skipping inquiries.");
  } else {
    try {
      const raw = fs.readFileSync(inquiriesFile, "utf-8");
      const inquiries = JSON.parse(raw);
      if (!Array.isArray(inquiries) || inquiries.length === 0) {
        console.log("   data/inquiries.json is empty. Zero inquiries to import.");
      } else {
        console.log(`   Found ${inquiries.length} inquiry/inquiries to process.`);

        let insertedCount = 0;
        let skippedCount = 0;

        for (const inq of inquiries) {
          const { data: existing } = await supabase
            .from("contact_inquiries")
            .select("id")
            .eq("id", inq.id)
            .maybeSingle();

          if (existing) {
            skippedCount++;
            continue;
          }

          if (!isDryRun) {
            const { error: insertError } = await supabase.from("contact_inquiries").insert({
              id: inq.id,
              name: inq.name,
              email: inq.email,
              category: inq.category || "Something else",
              message: inq.message,
              client_hash: inq.clientHash || null,
              created_at: inq.createdAt || new Date().toISOString(),
              status: "new",
            });

            if (insertError) {
              console.error(`   [ERROR] Failed to insert inquiry ${inq.id}: ${insertError.message}`);
            } else {
              insertedCount++;
            }
          } else {
            insertedCount++;
          }
        }

        console.log(`   Inquiries Summary: ${insertedCount} imported, ${skippedCount} skipped.\n`);
      }
    } catch (err) {
      console.error("   Failed to read or parse data/inquiries.json:", err.message);
    }
  }

  console.log("Migration routine finished.");
}

runMigration().catch((err) => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});
