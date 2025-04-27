package eu.cvmatch.backend.model;

import java.util.Comparator;
import java.util.List;
import java.util.StringJoiner;

public class JobPosting {
    private String title;
    private String industry;
    private String description;
    private List<TechnicalSkill> technicalSkills;

    public static class TechnicalSkill {
        private String skill;
        private int weight;

        // Getters and setters
        public String getSkill() { return skill; }
        public void setSkill(String skill) { this.skill = skill; }

        public int getWeight() { return weight; }
        public void setWeight(int weight) { this.weight = weight; }

        @Override
        public String toString() {
            return skill + "(" + weight + "%)";
        }
    }

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<TechnicalSkill> getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(List<TechnicalSkill> technicalSkills) { this.technicalSkills = technicalSkills; }
    /**
     * Normalizes the technical skills’ weights so they sum exactly to 100.
     * Negative weights are clamped to zero. After proportional rounding,
     * any leftover delta is applied to the largest-weight skill.
     */
    public void normalizeTechnicalSkillsScore() {
        if (technicalSkills == null || technicalSkills.isEmpty()) {
            return;
        }

        // 1) Clamp negatives to zero
        technicalSkills.forEach(skill -> {
            if (skill.getWeight() < 0) {
                skill.setWeight(0);
            }
        });

        // 2) First pass: proportional rounding
        int total = technicalSkills.stream()
                .mapToInt(TechnicalSkill::getWeight)
                .sum();
        if (total > 0) {
            for (TechnicalSkill skill : technicalSkills) {
                int w = skill.getWeight();
                skill.setWeight((int) Math.round((double) w / total * 100));
            }
        }

        // 3) Fix any rounding drift by adjusting the largest-weight skill
        total = technicalSkills.stream()
                .mapToInt(TechnicalSkill::getWeight)
                .sum();
        if (total != 100) {
            int delta = 100 - total;
            TechnicalSkill top = technicalSkills.stream()
                    .max(Comparator.comparingInt(TechnicalSkill::getWeight))
                    .orElseThrow();  // safe because we checked non-empty
            top.setWeight(top.getWeight() + delta);
        }
    }


    @Override
    public String toString() {
        StringJoiner sj = new StringJoiner(", ", "JobPosting[", "]");
        sj.add("jobTitle=" + title);
        sj.add("industry=" + industry);
        sj.add("description=" + (description != null && description.length() > 50
                ? description.substring(0, 47) + "..."
                : description));
        if (technicalSkills != null && !technicalSkills.isEmpty()) {
            sj.add("technicalSkills=" + technicalSkills);
        } else {
            sj.add("technicalSkills=[]");
        }
        return sj.toString();
    }
}
