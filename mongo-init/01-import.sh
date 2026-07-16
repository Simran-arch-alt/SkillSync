#!/bin/bash
echo "Importing jobs dataset into capstone_db.jobs..."
mongoimport --db capstone_db --collection jobs --type csv --headerline --drop --file /seed/jobs_dataset_skills_final.csv
echo "Import complete."
