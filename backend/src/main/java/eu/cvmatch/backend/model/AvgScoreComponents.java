package eu.cvmatch.backend.model;

public class AvgScoreComponents {
    private double industry;
    private double tech;
    private double jd;

    public AvgScoreComponents(double industry, double tech, double jd) {
        this.industry = industry;
        this.tech     = tech;
        this.jd       = jd;
    }

    public double getIndustry() {
        return industry;
    }

    public void setIndustry(double industry) {
        this.industry = industry;
    }

    public double getTech() {
        return tech;
    }

    public void setTech(double tech) {
        this.tech = tech;
    }

    public double getJd() {
        return jd;
    }

    public void setJd(double jd) {
        this.jd = jd;
    }

    @Override
    public String toString() {
        return "AvgScoreComponents{" +
                "industry=" + industry +
                ", tech=" + tech +
                ", jd=" + jd +
                '}';
    }
}