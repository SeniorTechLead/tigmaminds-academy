import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SevenSistersLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: `Capstone Design: Biodiversity Hotspot Analyzer`,
      concept: `This capstone integrates species-area curves, beta diversity, richness estimation, connectivity modeling, climate envelopes, and conservation prioritization into a unified Biodiversity Hotspot Analyzer. The system processes survey data from multiple sites, estimates true richness, maps diversity patterns, identifies conservation priorities, and projects climate change impacts.

The pipeline: (1) Data ingestion and validation. (2) Alpha and beta diversity computation. (3) Species richness estimation (Chao1). (4) Habitat suitability mapping. (5) Conservation priority scoring. (6) Report generation with actionable recommendations.`,
      analogy: `Building this analyzer is like assembling a complete medical diagnostic system: individual tests (blood work, X-ray, MRI) are useful alone, but the diagnostic system integrates them into a comprehensive health assessment.`,
      storyConnection: `In the story of the Seven Sisters, this concept manifests directly. The computational modeling we build here quantifies what the story describes qualitatively, turning narrative into science.`,
      checkQuestion: `What is the key limitation of this model, and how would you address it with real-world data?`,
      checkAnswer: `The main limitation is that our synthetic data simplifies real-world complexity. With real data, we would need to account for measurement error, missing observations, non-stationarity, and confounding variables. Cross-validation and sensitivity analysis would quantify how robust our conclusions are to these issues.`,
      codeIntro: `Build the computational model and visualize the key relationships.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

n_sites=20; n_sp=200
presence=np.random.binomial(1,0.3,(n_sites,n_sp))
richness=presence.sum(axis=1)
areas=np.random.uniform(100,5000,n_sites)
coords=np.random.uniform(0,100,(n_sites,2))

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax=axes[0,0]; ax.set_facecolor('#111827')
ax.scatter(areas,richness,c='#22c55e',s=50,edgecolors='white')
ax.set_xlabel('Area',color='white'); ax.set_ylabel('Species',color='white')
ax.set_title('Species-Area',color='white'); ax.tick_params(colors='gray')

ax=axes[0,1]; ax.set_facecolor('#111827')
for s in range(min(5,n_sites)):
    sorted_ab=np.sort(presence[s])[::-1]
    ax.plot(range(n_sp),sorted_ab,linewidth=1,alpha=0.5)
ax.set_title('Presence Patterns',color='white'); ax.tick_params(colors='gray')

ax=axes[0,2]; ax.set_facecolor('#111827')
f1=np.array([np.sum(presence[:,s]==1) for s in range(n_sp)])
ax.hist(presence.sum(axis=0),bins=20,color='#f59e0b',alpha=0.7)
ax.set_title('Species Frequency',color='white'); ax.tick_params(colors='gray')

ax=axes[1,0]; ax.set_facecolor('#111827')
sc=ax.scatter(coords[:,0],coords[:,1],c=richness,cmap='YlGn',s=80,edgecolors='white')
ax.set_title('Richness Map',color='white'); ax.tick_params(colors='gray')

ax=axes[1,1]; ax.set_facecolor('#111827')
# Accumulation curve
cum=[]; seen=set()
for s in np.argsort(-richness):
    seen.update(np.where(presence[s]>0)[0]); cum.append(len(seen))
ax.plot(range(1,n_sites+1),cum,'o-',color='#22c55e',linewidth=2)
ax.set_title('Species Accumulation',color='white'); ax.tick_params(colors='gray')

ax=axes[1,2]; ax.set_facecolor('#111827')
ax.axis('off')
total=len(set(np.where(presence.sum(axis=0)>0)[0]))
ax.text(0.1,0.5,f'Total species: {total}\
Sites: {n_sites}\
Mean richness: {richness.mean():.0f}',transform=ax.transAxes,fontsize=14,color='white')

plt.tight_layout()
plt.show()

print('Biodiversity Hotspot Analyzer complete')
print(f'Total species: {len(set(np.where(presence.sum(axis=0)>0)[0]))}')`,
      challenge: `Extend this analysis by adding a second variable or comparison, and quantify how it changes the conclusions.`,
      successHint: `This model captures the essential dynamics of biodiversity science. The same mathematical framework applies across scales and contexts.`,
    },
    {
      title: `Survey Data Processing Module`,
      concept: `Module 2 handles multi-site survey data: cleaning, validation, and standardization. Key steps include removing duplicate records, flagging suspicious observations (species outside known range), imputing missing environmental data, and standardizing effort across sites for fair comparison.

The module also computes sampling completeness for each site using Chao1 and identifies under-sampled sites that need additional survey effort before reliable analysis can proceed.`,
      analogy: `Data processing is like cleaning ore before smelting: the raw material contains impurities that must be removed before you can extract the valuable metal. Raw survey data contains errors, biases, and gaps that must be addressed before analysis.`,
      storyConnection: `In the story of the Seven Sisters, this concept manifests directly. The computational modeling we build here quantifies what the story describes qualitatively, turning narrative into science.`,
      checkQuestion: `What is the key limitation of this model, and how would you address it with real-world data?`,
      checkAnswer: `The main limitation is that our synthetic data simplifies real-world complexity. With real data, we would need to account for measurement error, missing observations, non-stationarity, and confounding variables. Cross-validation and sensitivity analysis would quantify how robust our conclusions are to these issues.`,
      codeIntro: `Build the computational model and visualize the key relationships.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

n=100; sp=50
raw_data=np.random.poisson(5,(n,sp))
# Add noise
raw_data[np.random.choice(n,10),:]=0
raw_data[:,np.random.choice(sp,5)]=np.random.poisson(50,(n,5))
effort=np.random.uniform(1,10,n)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax=axes[0,0]; ax.set_facecolor('#111827')
ax.hist(raw_data.sum(axis=1),bins=20,color='#3b82f6',alpha=0.7)
ax.set_title('Raw Counts per Site',color='white'); ax.tick_params(colors='gray')

ax=axes[0,1]; ax.set_facecolor('#111827')
std_data=raw_data/effort[:,None]
ax.hist(std_data.sum(axis=1),bins=20,color='#22c55e',alpha=0.7)
ax.set_title('Effort-Standardized Counts',color='white'); ax.tick_params(colors='gray')

ax=axes[0,2]; ax.set_facecolor('#111827')
richness_raw=np.sum(raw_data>0,axis=1)
chao1=[]
for s in range(n):
    f1=np.sum(raw_data[s]==1); f2=max(np.sum(raw_data[s]==2),1)
    S_obs=np.sum(raw_data[s]>0)
    chao1.append(S_obs+f1**2/(2*f2))
ax.scatter(richness_raw,chao1,c='#f59e0b',s=20,alpha=0.7)
ax.plot([0,50],[0,50],'--',color='white',alpha=0.3)
ax.set_xlabel('Observed',color='white'); ax.set_ylabel('Chao1',color='white')
ax.set_title('Estimated vs Observed Richness',color='white'); ax.tick_params(colors='gray')

ax=axes[1,0]; ax.set_facecolor('#111827')
completeness=np.array(richness_raw)/np.array(chao1)*100
ax.hist(completeness,bins=20,color='#a855f7',alpha=0.7)
ax.set_title('Sampling Completeness (%)',color='white'); ax.tick_params(colors='gray')

ax=axes[1,1]; ax.set_facecolor('#111827')
ax.scatter(effort,completeness,c='#22c55e',s=20)
ax.set_xlabel('Effort',color='white'); ax.set_ylabel('Completeness %',color='white')
ax.set_title('Effort vs Completeness',color='white'); ax.tick_params(colors='gray')

ax=axes[1,2]; ax.set_facecolor('#111827')
ax.bar(['Zero sites','Normal','Outlier'],[10,80,10],color=['#ef4444','#22c55e','#f59e0b'])
ax.set_title('Data Quality Summary',color='white'); ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f'Mean completeness: {completeness.mean():.0f}%')
print(f'Under-sampled sites (<70%): {np.sum(completeness<70)}')`,
      challenge: `Extend this analysis by adding a second variable or comparison, and quantify how it changes the conclusions.`,
      successHint: `This model captures the essential dynamics of biodiversity science. The same mathematical framework applies across scales and contexts.`,
    },
    {
      title: `Diversity Pattern Analysis`,
      concept: `Module 3 computes alpha, beta, and gamma diversity across the survey region. Alpha diversity uses Shannon and Simpson indices. Beta diversity uses Jaccard and Bray-Curtis. Gamma diversity is the total regional species pool.

The additive partition gamma = alpha + beta tells us whether regional diversity comes from high local richness (alpha) or high turnover between sites (beta). This directly informs whether conservation should focus on protecting rich sites or maintaining connections between different sites.`,
      analogy: `Diversity partitioning is like analyzing the diversity of a library. Alpha = how many different books are in each room. Beta = how different the rooms are from each other. Gamma = total unique books in the whole library. A library with identical rooms has high alpha but zero beta; one with completely different rooms has maximum beta.`,
      storyConnection: `In the story of the Seven Sisters, this concept manifests directly. The computational modeling we build here quantifies what the story describes qualitatively, turning narrative into science.`,
      checkQuestion: `What is the key limitation of this model, and how would you address it with real-world data?`,
      checkAnswer: `The main limitation is that our synthetic data simplifies real-world complexity. With real data, we would need to account for measurement error, missing observations, non-stationarity, and confounding variables. Cross-validation and sensitivity analysis would quantify how robust our conclusions are to these issues.`,
      codeIntro: `Build the computational model and visualize the key relationships.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

n_s=15; n_sp=100
abundance=np.zeros((n_s,n_sp),dtype=int)
for s in range(n_s):
    probs=np.random.dirichlet(np.ones(n_sp)*0.5)
    abundance[s]=np.random.multinomial(200,probs)

def shannon(a):
    total=a.sum()
    if total==0: return 0
    p=a[a>0]/total
    return -np.sum(p*np.log(p))

H=np.array([shannon(abundance[s]) for s in range(n_s)])
S=np.sum(abundance>0,axis=1)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax=axes[0,0]; ax.set_facecolor('#111827')
ax.scatter(S,H,c='#22c55e',s=50,edgecolors='white')
ax.set_xlabel('Richness',color='white'); ax.set_ylabel('Shannon H',color='white')
ax.set_title('Alpha Diversity',color='white'); ax.tick_params(colors='gray')

ax=axes[0,1]; ax.set_facecolor('#111827')
jac=np.zeros((n_s,n_s))
for i in range(n_s):
    for j in range(n_s):
        a,b=set(np.where(abundance[i]>0)[0]),set(np.where(abundance[j]>0)[0])
        jac[i,j]=len(a&b)/len(a|b) if len(a|b)>0 else 0
im=ax.imshow(jac,cmap='YlGn'); ax.set_title('Jaccard Similarity',color='white'); ax.tick_params(colors='gray')

ax=axes[0,2]; ax.set_facecolor('#111827')
gamma=len(set(np.where(abundance.sum(axis=0)>0)[0]))
alpha_mean=S.mean()
beta_add=gamma-alpha_mean
ax.bar(['Alpha','Beta','Gamma'],[alpha_mean,beta_add,gamma],color=['#22c55e','#f59e0b','#3b82f6'])
ax.set_title('Diversity Partition',color='white'); ax.tick_params(colors='gray')

ax=axes[1,0]; ax.set_facecolor('#111827')
for s in [0,5,10]:
    ab=np.sort(abundance[s])[::-1]; ab=ab[ab>0]
    ax.semilogy(range(1,len(ab)+1),ab/ab.sum(),'o-',markersize=3,linewidth=1.5)
ax.set_title('Rank-Abundance',color='white'); ax.tick_params(colors='gray')

ax=axes[1,1]; ax.set_facecolor('#111827')
cum=[]; seen=set()
for s in range(n_s):
    seen.update(np.where(abundance[s]>0)[0]); cum.append(len(seen))
ax.plot(range(1,n_s+1),cum,'o-',color='#a855f7',linewidth=2)
ax.axhline(gamma,color='white',linestyle='--',alpha=0.3)
ax.set_title('Accumulation',color='white'); ax.tick_params(colors='gray')

ax=axes[1,2]; ax.set_facecolor('#111827')
ax.axis('off')
ax.text(0.1,0.5,f'Gamma: {gamma}\
Mean Alpha: {alpha_mean:.0f}\
Beta: {beta_add:.0f}\
Beta fraction: {beta_add/gamma:.0%}',transform=ax.transAxes,fontsize=12,color='white')

plt.tight_layout()
plt.show()

print(f'Gamma={gamma}, Alpha={alpha_mean:.0f}, Beta={beta_add:.0f}')
print(f'Beta accounts for {beta_add/gamma:.0%} of total diversity')`,
      challenge: `Extend this analysis by adding a second variable or comparison, and quantify how it changes the conclusions.`,
      successHint: `This model captures the essential dynamics of biodiversity science. The same mathematical framework applies across scales and contexts.`,
    },
    {
      title: `Habitat Suitability and Climate Projection`,
      concept: `Module 4 models habitat suitability using environmental variables and projects future distributions under climate change scenarios. The model uses logistic regression trained on presence/absence data with climate covariates (temperature, precipitation, elevation, land cover).

Under warming scenarios, species distributions shift upslope and poleward. The module quantifies range contraction for each species and flags those at highest extinction risk (losing >50% of suitable habitat).`,
      analogy: `Habitat modeling is like a dating app for species — matching organisms with environments based on compatibility scores. Climate change changes the environment's 'profile,' and some matches break down.`,
      storyConnection: `In the story of the Seven Sisters, this concept manifests directly. The computational modeling we build here quantifies what the story describes qualitatively, turning narrative into science.`,
      checkQuestion: `What is the key limitation of this model, and how would you address it with real-world data?`,
      checkAnswer: `The main limitation is that our synthetic data simplifies real-world complexity. With real data, we would need to account for measurement error, missing observations, non-stationarity, and confounding variables. Cross-validation and sensitivity analysis would quantify how robust our conclusions are to these issues.`,
      codeIntro: `Build the computational model and visualize the key relationships.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

n_pts=300; n_sp=20
temp=np.random.uniform(10,35,n_pts)
precip=np.random.uniform(500,3000,n_pts)
elev=np.random.uniform(0,3000,n_pts)
presence=np.zeros((n_pts,n_sp),dtype=int)
for sp in range(n_sp):
    t_opt=np.random.uniform(15,30); p_opt=np.random.uniform(1000,2500)
    suit=np.exp(-((temp-t_opt)/5)**2-((precip-p_opt)/500)**2)
    presence[:,sp]=(np.random.random(n_pts)<suit*0.6).astype(int)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax=axes[0,0]; ax.set_facecolor('#111827')
ax.scatter(temp,precip,c=presence.sum(axis=1),cmap='YlGn',s=10)
ax.set_xlabel('Temp',color='white'); ax.set_ylabel('Precip',color='white')
ax.set_title('Richness in Climate Space',color='white'); ax.tick_params(colors='gray')

ax=axes[0,1]; ax.set_facecolor('#111827')
temp_future=temp+2
suit_current=np.sum(presence,axis=1)
suit_future_est=suit_current*(1-0.1*(temp_future-temp)/2)
ax.scatter(suit_current,suit_future_est,c='#ef4444',s=10,alpha=0.5)
ax.plot([0,20],[0,20],'--',color='white')
ax.set_xlabel('Current richness',color='white'); ax.set_ylabel('Projected',color='white')
ax.set_title('Climate Impact',color='white'); ax.tick_params(colors='gray')

ax=axes[0,2]; ax.set_facecolor('#111827')
loss_pct=(1-suit_future_est/np.maximum(suit_current,1))*100
ax.hist(loss_pct,bins=30,color='#ef4444',alpha=0.7)
ax.set_title('% Species Loss per Site',color='white'); ax.tick_params(colors='gray')

for idx in range(3):
    ax=axes[1,idx]; ax.set_facecolor('#111827')
    sp=idx*5
    ax.scatter(temp,precip,c=presence[:,sp],cmap='RdYlGn',s=10)
    ax.set_title(f'Species {sp+1}',color='white'); ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f'Mean projected species loss: {loss_pct[loss_pct>0].mean():.1f}%')`,
      challenge: `Extend this analysis by adding a second variable or comparison, and quantify how it changes the conclusions.`,
      successHint: `This model captures the essential dynamics of biodiversity science. The same mathematical framework applies across scales and contexts.`,
    },
    {
      title: `Conservation Priority Network Design`,
      concept: `Module 5 designs an optimal reserve network using complementarity-based selection, incorporating costs, connectivity, and representation targets. The system implements a greedy algorithm that iteratively selects sites maximizing marginal species gain per unit cost.

The output is a ranked list of conservation priorities with maps showing the recommended reserve network, species coverage curve, and cost-effectiveness analysis.`,
      analogy: `Reserve design is like building a team with a salary cap: you want maximum skill diversity (species coverage) for minimum cost, and the best individual players are not always the best team.`,
      storyConnection: `In the story of the Seven Sisters, this concept manifests directly. The computational modeling we build here quantifies what the story describes qualitatively, turning narrative into science.`,
      checkQuestion: `What is the key limitation of this model, and how would you address it with real-world data?`,
      checkAnswer: `The main limitation is that our synthetic data simplifies real-world complexity. With real data, we would need to account for measurement error, missing observations, non-stationarity, and confounding variables. Cross-validation and sensitivity analysis would quantify how robust our conclusions are to these issues.`,
      codeIntro: `Build the computational model and visualize the key relationships.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

n_s=25; n_sp=150
presence=np.random.binomial(1,0.2,(n_s,n_sp))
costs=np.random.uniform(1,10,n_s)
coords=np.random.uniform(0,100,(n_s,2))
richness=presence.sum(axis=1)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Greedy complementarity
selected=[]; covered=set(); remaining=list(range(n_s)); cum_sp=[]; cum_cost=[0]
total_cost=0
while remaining:
    best_s,best_eff=-1,-1
    for s in remaining:
        new=len(set(np.where(presence[s]>0)[0])-covered)
        eff=new/(costs[s]+0.01)
        if eff>best_eff: best_s,best_eff=s,eff
    if best_eff<=0: break
    selected.append(best_s); remaining.remove(best_s)
    covered.update(np.where(presence[best_s]>0)[0])
    total_cost+=costs[best_s]
    cum_sp.append(len(covered)); cum_cost.append(total_cost)

rich_order=np.argsort(-richness)
rich_cum=[]; seen_r=set()
for s in rich_order:
    seen_r.update(np.where(presence[s]>0)[0]); rich_cum.append(len(seen_r))

ax=axes[0,0]; ax.set_facecolor('#111827')
ax.plot(range(1,len(cum_sp)+1),cum_sp,'o-',color='#22c55e',linewidth=2,label='Complementarity')
ax.plot(range(1,n_s+1),rich_cum,'s-',color='#f59e0b',linewidth=2,label='Richness')
total=len(set(np.where(presence.sum(axis=0)>0)[0]))
ax.axhline(total*0.9,color='white',linestyle='--',alpha=0.3)
ax.set_title('Species Accumulation',color='white'); ax.legend(fontsize=7,facecolor='#1f2937',edgecolor='gray',labelcolor='white')
ax.tick_params(colors='gray')

ax=axes[0,1]; ax.set_facecolor('#111827')
ax.plot(cum_cost,cum_sp,'o-',color='#22c55e',linewidth=2)
ax.set_xlabel('Cumulative Cost',color='white'); ax.set_ylabel('Species',color='white')
ax.set_title('Cost-Effectiveness',color='white'); ax.tick_params(colors='gray')

ax=axes[0,2]; ax.set_facecolor('#111827')
for i in range(n_s):
    col='#22c55e' if i in selected[:5] else '#6b7280'
    ax.scatter(coords[i,0],coords[i,1],s=richness[i]*3,color=col,edgecolors='white' if i in selected[:5] else 'none',linewidth=2)
ax.set_title('Top 5 Priority Sites',color='white'); ax.tick_params(colors='gray')

ax=axes[1,0]; ax.set_facecolor('#111827')
irr=[len(set(np.where(presence[s]>0)[0])-set(np.where(np.delete(presence,s,axis=0).sum(axis=0)>0)[0])) for s in range(n_s)]
ax.barh(range(n_s),irr,color=['#ef4444' if i>0 else '#22c55e' for i in irr])
ax.set_title('Irreplaceability',color='white'); ax.tick_params(colors='gray')

ax=axes[1,1]; ax.set_facecolor('#111827')
ax.scatter(costs,richness,c='#3b82f6',s=50,edgecolors='white')
for s in selected[:5]: ax.scatter(costs[s],richness[s],s=150,facecolors='none',edgecolors='#22c55e',linewidth=2)
ax.set_xlabel('Cost',color='white'); ax.set_ylabel('Richness',color='white')
ax.set_title('Cost vs Richness',color='white'); ax.tick_params(colors='gray')

ax=axes[1,2]; ax.set_facecolor('#111827')
ax.axis('off')
ax.text(0.1,0.5,f'Total species: {total}\
Sites for 90%: {next((i+1 for i,s in enumerate(cum_sp) if s>=total*0.9),len(cum_sp))}\
Cost for 90%: {cum_cost[next((i+1 for i,s in enumerate(cum_sp) if s>=total*0.9),len(cum_sp))  ]:.1f}',transform=ax.transAxes,fontsize=12,color='white')

plt.tight_layout()
plt.show()

print(f'Conservation network designed: {len(selected)} sites, {len(covered)} species')`,
      challenge: `Extend this analysis by adding a second variable or comparison, and quantify how it changes the conclusions.`,
      successHint: `This model captures the essential dynamics of biodiversity science. The same mathematical framework applies across scales and contexts.`,
    },
    {
      title: `Deployment: Complete Biodiversity Hotspot Analyzer`,
      concept: `The final module integrates survey processing, diversity analysis, habitat modeling, and conservation prioritization into a single deployable system. The analyzer accepts survey data, validates it, computes all biodiversity metrics, generates conservation recommendations, and produces a comprehensive report.

This capstone demonstrates the complete arc from raw field data to conservation action — the same pipeline used by organizations like WWF and IUCN to assess biodiversity hotspots worldwide.`,
      analogy: `The complete analyzer is like a hospital's diagnostic system: individual tests are integrated into a comprehensive health assessment that leads to a treatment plan. Our analyzer integrates biodiversity tests into a conservation prescription.`,
      storyConnection: `In the story of the Seven Sisters, this concept manifests directly. The computational modeling we build here quantifies what the story describes qualitatively, turning narrative into science.`,
      checkQuestion: `What is the key limitation of this model, and how would you address it with real-world data?`,
      checkAnswer: `The main limitation is that our synthetic data simplifies real-world complexity. With real data, we would need to account for measurement error, missing observations, non-stationarity, and confounding variables. Cross-validation and sensitivity analysis would quantify how robust our conclusions are to these issues.`,
      codeIntro: `Build the computational model and visualize the key relationships.`,
      code: `import numpy as np
import matplotlib.pyplot as plt
np.random.seed(42)

class HotspotAnalyzer:
    def __init__(self,n_sites,n_species):
        self.n_s=n_sites; self.n_sp=n_species
    def compute_alpha(self,abundance):
        S=np.sum(abundance>0,axis=1)
        H=np.array([-np.sum((a[a>0]/a.sum())*np.log(a[a>0]/a.sum())) if a.sum()>0 else 0 for a in abundance])
        return S,H
    def compute_gamma(self,abundance):
        return np.sum(abundance.sum(axis=0)>0)
    def prioritize(self,presence,n_select=5):
        sel=[]; cov=set(); rem=list(range(presence.shape[0]))
        for _ in range(n_select):
            best,best_n=-1,-1
            for s in rem:
                n=len(set(np.where(presence[s]>0)[0])-cov)
                if n>best_n: best,best_n=s,n
            if best_n<=0: break
            sel.append(best); rem.remove(best); cov.update(np.where(presence[best]>0)[0])
        return sel,len(cov)

analyzer=HotspotAnalyzer(20,100)
abundance=np.random.poisson(3,(20,100))
S,H=analyzer.compute_alpha(abundance)
gamma=analyzer.compute_gamma(abundance)
sel,cov=analyzer.prioritize((abundance>0).astype(int),5)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

ax=axes[0,0]; ax.set_facecolor('#111827')
ax.scatter(S,H,c='#22c55e',s=50,edgecolors='white')
ax.set_title('Alpha Diversity',color='white'); ax.tick_params(colors='gray')

ax=axes[0,1]; ax.set_facecolor('#111827')
ax.bar(['Gamma','Mean Alpha','Beta'],[gamma,S.mean(),gamma-S.mean()],color=['#3b82f6','#22c55e','#f59e0b'])
ax.set_title('Diversity Partition',color='white'); ax.tick_params(colors='gray')

ax=axes[0,2]; ax.set_facecolor('#111827')
ax.bar(range(5),[S[s] for s in sel],color='#22c55e')
ax.set_title('Priority Site Richness',color='white'); ax.tick_params(colors='gray')

ax=axes[1,0]; ax.set_facecolor('#111827')
ax.hist(S,bins=15,color='#3b82f6',alpha=0.7)
ax.set_title('Richness Distribution',color='white'); ax.tick_params(colors='gray')

ax=axes[1,1]; ax.set_facecolor('#111827')
ax.hist(H,bins=15,color='#f59e0b',alpha=0.7)
ax.set_title('Shannon Distribution',color='white'); ax.tick_params(colors='gray')

ax=axes[1,2]; ax.set_facecolor('#111827')
ax.axis('off')
rpt=f'BIODIVERSITY HOTSPOT REPORT\
{"="*30}\
Gamma: {gamma}\
Mean Alpha: {S.mean():.0f}\
Beta: {gamma-S.mean():.0f}\
Priority sites: {sel}\
Species covered: {cov}'
ax.text(0.05,0.95,rpt,transform=ax.transAxes,fontsize=9,color='white',verticalalignment='top',fontfamily='monospace')

plt.tight_layout()
plt.show()

print('CAPSTONE COMPLETE')
print('='*55)
print('Biodiversity Hotspot Analyzer built from scratch')
print(f'Gamma={gamma}, Coverage with 5 sites={cov}')`,
      challenge: `Extend this analysis by adding a second variable or comparison, and quantify how it changes the conclusions.`,
      successHint: `This model captures the essential dynamics of biodiversity science. The same mathematical framework applies across scales and contexts.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (biodiversity science)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python to build a Biodiversity Hotspot Analyzer. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
