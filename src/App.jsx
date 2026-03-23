import { useState } from "react";

const data = {
  compute: {
    tab: "☁️ Compute",
    items: [
      { name: "EC2", full: "Elastic Compute Cloud", color: "#E8593C", lightBg: "#FEF0ED", icon: "🖥️", tagline: "Virtual servers in the cloud", analogy: "Renting a computer — you choose the OS, size, and software.", keyPoints: ["Pay per hour/second", "Choose CPU, RAM, storage, OS", "You manage the server"], when: "Full control over environment; lift-and-shift migrations", pricing: "On-Demand · Reserved (1–3yr, up to 72% off) · Spot (up to 90% off) · Savings Plans" },
      { name: "AMI", full: "Amazon Machine Image", color: "#C0392B", lightBg: "#FDEDEC", icon: "📸", tagline: "Snapshot template for EC2", analogy: "A golden master disk image — stamp out identical EC2 instances instantly.", keyPoints: ["Includes OS, software, config", "Launch new EC2 instances from it", "Share across accounts/regions"], when: "Replicating environments, auto-scaling launch templates, DR", pricing: "Storage charged as EBS snapshot (~$0.05/GB/month). Creating/copying is free." },
      { name: "Lambda", full: "AWS Lambda", color: "#E8983C", lightBg: "#FEF5ED", icon: "λ", tagline: "Run code without servers", analogy: "A vending machine — push a button, it runs, you pay only for that moment.", keyPoints: ["No server management", "Triggered by events (S3, API Gateway, SQS…)", "Pay per execution in milliseconds"], when: "Event-driven tasks, API backends, scheduled jobs", pricing: "1M requests/month free · $0.20/1M after · $0.0000166667/GB-sec compute" },
      { name: "Auto Scaling", full: "EC2 Auto Scaling", color: "#7D6608", lightBg: "#FEFCE8", icon: "📈", tagline: "Automatically add/remove EC2 instances", analogy: "A thermostat for your server fleet — adds capacity when hot, removes it when quiet, always hitting the target.", keyPoints: ["Scale out on high CPU/load, scale in when quiet", "Min, desired, and max instance counts", "Works with ALB/NLB for traffic distribution", "Scheduled, dynamic, or predictive scaling modes"], when: "Any variable-traffic production workload — pairs with ELB for HA", pricing: "Auto Scaling itself is free. You pay for the EC2 instances it launches." },
      { name: "ECS", full: "Elastic Container Service", color: "#9B59B6", lightBg: "#F5EEF8", icon: "📦", tagline: "Run Docker containers", analogy: "A shipping yard that manages standardized Docker containers for you.", keyPoints: ["AWS-managed container orchestration", "Works with Docker", "Uses EC2 or Fargate underneath"], when: "Docker workloads with AWS-native orchestration", pricing: "ECS itself is free. Pay for EC2 or Fargate resources." },
      { name: "EKS", full: "Elastic Kubernetes Service", color: "#2E86AB", lightBg: "#EBF5FB", icon: "⎈", tagline: "Managed Kubernetes", analogy: "ECS but with Kubernetes — the industry-standard container orchestrator.", keyPoints: ["AWS manages Kubernetes control plane", "More flexible than ECS", "Steeper learning curve"], when: "Existing K8s workloads or multi-cloud portability", pricing: "$0.10/hr per cluster + EC2/Fargate for worker nodes." },
      { name: "Fargate", full: "AWS Fargate", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🚀", tagline: "Serverless containers", analogy: "ECS/EKS without worrying about the underlying servers at all.", keyPoints: ["No EC2 to manage", "Works with ECS or EKS", "Pay per vCPU + memory used"], when: "Containers with zero server management", pricing: "$0.04048/vCPU-hr + $0.004445/GB-hr." },
      { name: "Beanstalk", full: "AWS Elastic Beanstalk", color: "#5D6D7E", lightBg: "#F2F3F4", icon: "🌱", tagline: "Deploy apps without managing infra", analogy: "Like Heroku on AWS — upload code, it handles the rest.", keyPoints: ["Auto-provisions EC2, ELB, scaling", "Supports many languages/runtimes", "EC2 under the hood — you can still access it"], when: "Quick deployments without configuring infrastructure", pricing: "Beanstalk free. Pay for EC2, ELB, RDS it provisions." },
    ]
  },
  storage: {
    tab: "🗄️ Storage",
    items: [
      { name: "S3", full: "Simple Storage Service", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🪣", tagline: "Object storage for anything", analogy: "A giant hard drive in the cloud — store any file and access it via URL.", keyPoints: ["Stores files as 'objects' in 'buckets'", "11 nines (99.999999999%) durability", "Multiple storage classes — see S3 Classes tab"], when: "Files, images, backups, logs, static websites", pricing: "Varies by class. Standard ~$0.023/GB/month. See S3 Classes tab." },
      { name: "S3 Standard", full: "S3 Standard", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🪣⭐", tagline: "Default — frequent access, 3+ AZs", analogy: "Your everyday desk drawer — instant access, highest cost, most resilient.", keyPoints: ["99.99% availability, 11 9s durability", "Replicated across ≥3 AZs", "No retrieval fee, no minimum duration"], when: "Frequently accessed data: active apps, content distribution", pricing: "~$0.023/GB/month. No retrieval fee." },
      { name: "S3 IA", full: "S3 Standard-Infrequent Access", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🪣🔒", tagline: "Cheaper storage, pay to retrieve", analogy: "A filing cabinet in the back room — cheaper to store, but you pay a fee to pull something out.", keyPoints: ["Same durability as Standard (3+ AZs)", "30-day minimum storage duration", "Per-GB retrieval fee"], when: "Backups, DR files accessed a few times per month", pricing: "~$0.0125/GB/month · $0.01/GB retrieval. 30-day minimum." },
      { name: "S3 One Zone-IA", full: "S3 One Zone-Infrequent Access", color: "#E8983C", lightBg: "#FEF5ED", icon: "🪣1️⃣", tagline: "Single AZ, cheaper IA", analogy: "Standard-IA stored in one data centre — cheaper, but data lost if that AZ fails.", keyPoints: ["Single AZ only (vs 3+ for Standard)", "20% cheaper than Standard-IA", "Data at risk if AZ is destroyed"], when: "Reproducible/derived data you rarely access (thumbnails, processed files)", pricing: "~$0.01/GB/month · $0.01/GB retrieval. 30-day minimum." },
      { name: "Intelligent-Tiering", full: "S3 Intelligent-Tiering", color: "#9B59B6", lightBg: "#F5EEF8", icon: "🪣🤖", tagline: "Auto-moves objects between tiers", analogy: "A smart filing system that watches how often you use each file and moves it to the cheapest tier automatically.", keyPoints: ["Monitors access; auto-moves between Frequent/Infrequent/Archive", "No retrieval fees, no minimum duration", "Small per-object monitoring fee"], when: "Unpredictable or changing access patterns", pricing: "~$0.023 – ~$0.0025/GB auto-tiered + $0.0025/1000 objects monitored." },
      { name: "Glacier Instant", full: "S3 Glacier Instant Retrieval", color: "#5D6D7E", lightBg: "#F2F3F4", icon: "🧊⚡", tagline: "Archive with millisecond retrieval", analogy: "A deep freezer with a microwave — cheap storage, instant access when you need it.", keyPoints: ["Millisecond retrieval", "90-day minimum duration", "Higher retrieval cost than IA"], when: "Quarterly-access data: medical images, news archives", pricing: "~$0.004/GB/month · $0.03/GB retrieval. 90-day minimum." },
      { name: "Glacier Flexible", full: "S3 Glacier Flexible Retrieval", color: "#7D6608", lightBg: "#FEFCE8", icon: "🧊🕐", tagline: "Very cheap archive, minutes–hours retrieval", analogy: "A warehouse — very cheap, but you order a retrieval and wait for it.", keyPoints: ["Expedited (1–5 min) · Standard (3–5 hr) · Bulk (5–12 hr)", "90-day minimum duration", "Bulk retrievals are free"], when: "Compliance archives retrieved occasionally", pricing: "~$0.0036/GB/month · Expedited $0.03/GB · Bulk free." },
      { name: "Glacier Deep Archive", full: "S3 Glacier Deep Archive", color: "#C0392B", lightBg: "#FDEDEC", icon: "🧊🏔️", tagline: "Cheapest AWS storage — 12hr retrieval", analogy: "A vault buried underground — lowest possible cost, but retrieving anything takes 12 hours.", keyPoints: ["~$0.00099/GB/month — cheapest in AWS", "Standard: 12 hrs · Bulk: up to 48 hrs", "180-day minimum duration"], when: "7–10 year compliance retention (financial, healthcare)", pricing: "~$0.00099/GB/month · Standard retrieval $0.02/GB · Bulk $0.0025/GB." },
      { name: "S3 Lifecycle", full: "S3 Lifecycle Policies", color: "#E8593C", lightBg: "#FEF0ED", icon: "♻️", tagline: "Auto-transition or expire objects", analogy: "A conveyor belt — objects automatically move to cheaper classes or get deleted after N days.", keyPoints: ["Transition: move to IA, Glacier, Deep Archive after N days", "Expiration: auto-delete after N days", "Target by prefix, tags, or object size"], when: "Any bucket where data ages: logs, backups, media files", pricing: "Rules are free. Per-request transition fee ~$0.01/1000 requests." },
      { name: "S3 Transfer Acceleration", full: "S3 Transfer Acceleration", color: "#9B59B6", lightBg: "#F5EEF8", icon: "🪣🏎️", tagline: "Speed up S3 uploads globally", analogy: "Instead of sending a file across the slow public internet to S3, it enters AWS via the nearest CloudFront edge and travels the fast AWS backbone to your bucket.", keyPoints: ["Uses CloudFront edge network as upload on-ramp", "Biggest benefit for users far from the S3 bucket region", "Enable per-bucket; uses a different endpoint URL", "Useful for large files or globally distributed uploaders"], when: "Users uploading large files to S3 from across the world", pricing: "$0.04/GB additional for transfers accelerated via edge locations outside US. Test first — only pay if faster." },
      { name: "EFS", full: "Elastic File System", color: "#C0392B", lightBg: "#FDEDEC", icon: "📁", tagline: "Shared file system for multiple EC2s", analogy: "A shared network drive — multiple EC2 instances (even across AZs) can all read and write to it simultaneously.", keyPoints: ["NFS-based — mount on many EC2s at once", "Auto-scales storage up and down (no provisioning)", "Two tiers: Standard and Infrequent Access (IA)"], when: "Shared file access across multiple EC2 instances or containers", pricing: "Standard ~$0.30/GB/month · IA ~$0.025/GB/month + $0.01/GB access. ~4× more expensive than EBS but shared." },
      { name: "AWS Backup", full: "AWS Backup", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🛡️", tagline: "Centralised backup across AWS services", analogy: "A single control panel to schedule and manage backups for all your AWS resources.", keyPoints: ["Policy-driven backup schedules", "Covers EC2, RDS, EFS, DynamoDB, EBS & more", "Cross-region & cross-account support"], when: "Compliance, DR, managing backups centrally across services", pricing: "Pay storage rates + $0.01/GB/month for Vault Lock (WORM compliance)." },
      { name: "Storage Gateway", full: "AWS Storage Gateway", color: "#7D6608", lightBg: "#FEFCE8", icon: "🔌", tagline: "Bridge between on-prem and AWS", analogy: "A translator that lets your on-premises servers talk to AWS storage seamlessly.", keyPoints: ["File, Volume, or Tape gateway modes", "Connects on-prem to S3/EBS/Glacier", "Hybrid cloud setups"], when: "Migrating to cloud gradually; hybrid on-prem + AWS", pricing: "~$0.01–$0.03/GB transferred + storage costs." },
      { name: "FSx", full: "Amazon FSx", color: "#E8983C", lightBg: "#FEF5ED", icon: "🗂️", tagline: "Managed file systems (Windows/Lustre)", analogy: "EFS for Windows workloads or HPC needs.", keyPoints: ["FSx for Windows = SMB/NTFS", "FSx for Lustre = HPC & ML workloads", "Fully managed"], when: "Windows file shares or high-performance computing", pricing: "Windows ~$0.13/GB/month · Lustre ~$0.14/GB/month." },
    ]
  },
  ebs: {
    tab: "💾 EBS",
    items: [
      { name: "EBS Overview", full: "Elastic Block Store", color: "#E8593C", lightBg: "#FEF0ED", icon: "💾", tagline: "Persistent block storage for EC2", analogy: "A hard drive you attach to an EC2. Persists independently — detach from one instance, attach to another.", keyPoints: ["Attached to one EC2 at a time (typically)", "Persists after instance stop/terminate", "Two families: SSD (gp3, gp2, io2, io1) and HDD (st1, sc1)"], when: "Any EC2 needing persistent disk storage", pricing: "Charged per GB provisioned/month + IOPS for io1/io2. Snapshots ~$0.05/GB/month." },
      { name: "gp3 (SSD)", full: "General Purpose SSD v3", color: "#2E86AB", lightBg: "#EBF5FB", icon: "💾⚡", tagline: "Default SSD — cheapest, fastest general use", analogy: "A modern NVMe SSD — fast baseline and you can independently dial up IOPS or throughput without paying for more storage.", keyPoints: ["3,000 IOPS & 125 MB/s included free regardless of size", "Scale to 16,000 IOPS & 1,000 MB/s independently", "20% cheaper than gp2 — migrate gp2 → gp3"], when: "Default for most workloads: boot volumes, dev/test, small-to-mid databases", pricing: "~$0.08/GB/month. Extra IOPS: $0.005/IOPS above 3k. Extra throughput: $0.04/MB/s above 125." },
      { name: "gp2 (SSD)", full: "General Purpose SSD v2", color: "#9B59B6", lightBg: "#F5EEF8", icon: "💾🔵", tagline: "Legacy general SSD — IOPS tied to size", analogy: "An older SSD where speed and size are locked together — need more IOPS? Buy more storage, even if you don't need it.", keyPoints: ["IOPS = 3× GB (min 100, max 16,000)", "Burst to 3,000 IOPS for volumes < 1TB", "IOPS and throughput cannot be set independently"], when: "Legacy only — prefer gp3 for all new volumes", pricing: "~$0.10/GB/month. No separate IOPS charge but you overpay on storage to hit IOPS targets." },
      { name: "io2 Block Express", full: "Provisioned IOPS SSD io2 Block Express", color: "#C0392B", lightBg: "#FDEDEC", icon: "💾🔴", tagline: "Highest-performance SSD for critical DBs", analogy: "A race-spec SSD — extreme guaranteed IOPS for your most demanding databases.", keyPoints: ["Up to 256,000 IOPS & 4,000 MB/s", "Sub-millisecond latency", "99.999% durability — highest of any EBS type"], when: "Mission-critical DBs: Oracle, SQL Server, large RDS/Aurora needing consistent ultra-high IOPS", pricing: "~$0.125/GB/month + $0.065/provisioned IOPS/month." },
      { name: "io1 (SSD)", full: "Provisioned IOPS SSD io1", color: "#E8983C", lightBg: "#FEF5ED", icon: "💾🟠", tagline: "Older provisioned IOPS SSD", analogy: "The predecessor to io2 — same concept but lower max IOPS and durability.", keyPoints: ["Up to 64,000 IOPS (vs 256k for io2)", "99.9% durability (vs 99.999% for io2)", "Same price as io2 — io2 is better value"], when: "High-IOPS legacy workloads — AWS recommends io2 for new volumes", pricing: "~$0.125/GB/month + $0.065/IOPS/month. Same as io2, worse specs." },
      { name: "st1 (HDD)", full: "Throughput Optimized HDD", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "💿🟢", tagline: "High-throughput HDD for big sequential reads", analogy: "A spinning disk built for streaming large files — optimised for sequential reading, not random access.", keyPoints: ["Max 500 IOPS & 500 MB/s throughput", "Optimised for large sequential I/O", "Cannot be a boot volume"], when: "Big data, Kafka, log processing — large sequential files", pricing: "~$0.045/GB/month." },
      { name: "sc1 (HDD)", full: "Cold HDD", color: "#5D6D7E", lightBg: "#F2F3F4", icon: "💿🏔️", tagline: "Cheapest EBS — infrequent sequential access", analogy: "The cheapest spinning disk in AWS — for data you rarely touch but need attached to an EC2.", keyPoints: ["Max 250 IOPS & 250 MB/s", "Lowest cost EBS volume", "Cannot be a boot volume"], when: "Cold archival data still needing EC2 block access", pricing: "~$0.015/GB/month — cheapest EBS option." },
      { name: "EBS Snapshots", full: "EBS Snapshots", color: "#7D6608", lightBg: "#FEFCE8", icon: "📸💾", tagline: "Point-in-time backup of EBS volumes", analogy: "A photo of your hard drive — stored in S3, incremental after the first.", keyPoints: ["Incremental: only changed blocks after first snapshot", "Copy cross-region for DR", "Restore as new EBS volume or create AMI"], when: "Backing up EC2 disks, cross-region DR, creating AMIs", pricing: "~$0.05/GB/month. Only changed blocks charged after first full snapshot." },
      { name: "I/O Operations", full: "IOPS & Throughput", color: "#2E86AB", lightBg: "#EBF5FB", icon: "📊💾", tagline: "Understanding IOPS vs Throughput", analogy: "IOPS = how many times per second the disk can respond to requests (like transactions per second). Throughput = how much data flows per second (like a pipe width). A random-read DB cares about IOPS; a video stream cares about throughput.", keyPoints: ["IOPS (Input/Output Operations Per Second): key for random read/write DBs", "Throughput (MB/s): key for sequential workloads like big data, video", "gp3 lets you tune both independently — unique to gp3 among EBS types", "High IOPS + low throughput need = io2. High throughput + sequential = st1"], when: "Choosing the right EBS volume type for your workload", pricing: "Context: gp3 gives 3k IOPS free; io2 lets you provision up to 256k IOPS at cost." },
    ]
  },
  databases: {
    tab: "🗃️ Databases",
    items: [
      { name: "RDS", full: "Relational Database Service", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🗃️", tagline: "Managed SQL databases", analogy: "A rows-and-columns database managed by AWS — backups, patching, failover included.", keyPoints: ["MySQL, PostgreSQL, Oracle, SQL Server, MariaDB", "Multi-AZ for HA (standby replica)", "Read replicas for scaling reads"], when: "Traditional relational data — orders, users, transactions", pricing: "On-Demand or Reserved. db.t3.micro ~$0.017/hr. Multi-AZ doubles cost. Storage ~$0.115/GB/month." },
      { name: "Aurora", full: "Amazon Aurora", color: "#E8593C", lightBg: "#FEF0ED", icon: "✨", tagline: "AWS's supercharged SQL database", analogy: "RDS rebuilt from scratch — 5× faster than MySQL, auto-scaling, 6-way replication across 3 AZs.", keyPoints: ["MySQL & PostgreSQL compatible", "6 copies across 3 AZs automatically", "Up to 15 read replicas"], when: "High-performance relational workloads; drop-in MySQL/PostgreSQL replacement", pricing: "~$0.10/ACU-hr (Serverless v2). Storage ~$0.10/GB/month." },
      { name: "Aurora Global DB", full: "Aurora Global Database", color: "#C0392B", lightBg: "#FDEDEC", icon: "🌍✨", tagline: "Aurora replicated across regions", analogy: "Aurora with a shadow copy in another continent — failover in under a minute.", keyPoints: ["1 primary + up to 5 secondary regions", "Sub-second replication lag", "~1 min RTO for cross-region failover"], when: "Global apps needing low-latency reads; cross-region DR", pricing: "Aurora pricing + ~$0.20/million replicated write I/Os cross-region." },
      { name: "HA / DR", full: "High Availability & Disaster Recovery", color: "#5D6D7E", lightBg: "#F2F3F4", icon: "🔄", tagline: "Staying up & recovering fast", analogy: "HA = never going down. DR = getting back up fast when something does go wrong.", keyPoints: ["RTO = how fast you recover", "RPO = how much data you can lose", "Multi-AZ = HA; Multi-Region = DR"], when: "Every production system — plan for both", pricing: "Multi-AZ typically doubles DB cost. DR cost scales with standby strategy." },
      { name: "DynamoDB", full: "Amazon DynamoDB", color: "#9B59B6", lightBg: "#F5EEF8", icon: "⚡", tagline: "Serverless NoSQL key-value store", analogy: "A super-fast dictionary — look things up by key, no rigid table structure needed.", keyPoints: ["Single-digit millisecond latency at any scale", "On-demand or provisioned capacity", "TTL: auto-expire items at a set timestamp"], when: "Massive-scale apps: gaming leaderboards, carts, IoT", pricing: "On-Demand: ~$1.25/million writes, $0.25/million reads. 25GB free forever." },
      { name: "DAX", full: "DynamoDB Accelerator", color: "#E8593C", lightBg: "#FEF0ED", icon: "⚡🗃️", tagline: "In-memory cache for DynamoDB", analogy: "ElastiCache but built specifically for DynamoDB — sits in front of your DynamoDB table and serves hot reads at microsecond speed without changing your app code.", keyPoints: ["Microsecond latency (vs single-digit ms for DynamoDB)", "Fully managed, in-memory caching cluster", "Drop-in compatible — uses same DynamoDB API", "Ideal for read-heavy or bursty workloads"], when: "DynamoDB tables with high read traffic or cost issues from repeated identical queries", pricing: "dax.r5.large ~$0.269/hr per node. Requires multi-node cluster for HA (~$0.538/hr minimum)." },
      { name: "TTL", full: "Time To Live", color: "#7D6608", lightBg: "#FEFCE8", icon: "⏱️", tagline: "Auto-expire data after a set time", analogy: "A best-before date stamped on data — when it passes, the item is automatically deleted.", keyPoints: ["DynamoDB: set a Unix timestamp attribute as TTL", "ElastiCache/Redis: set TTL in seconds per key", "Reduces storage costs, keeps data fresh"], when: "Sessions, tokens, rate-limiting counters, logs you only keep for N days", pricing: "TTL deletions in DynamoDB are free. Redis expired keys free up memory automatically." },
      { name: "ElastiCache", full: "Amazon ElastiCache", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🧠", tagline: "In-memory caching layer", analogy: "A sticky note on your monitor — faster to read than opening a filing cabinet (your database).", keyPoints: ["Redis or Memcached engines", "Microsecond response times", "Reduces load and cost on primary database"], when: "Caching frequent DB queries, session storage, leaderboards", pricing: "cache.t3.micro ~$0.017/hr. Reserved saves up to 55%." },
      { name: "Redis", full: "Redis (via ElastiCache)", color: "#C0392B", lightBg: "#FDEDEC", icon: "🔴", tagline: "Advanced in-memory data store", analogy: "Memcached is a simple whiteboard. Redis is a whiteboard with sorting, pub/sub, persistence, and TTLs.", keyPoints: ["Rich types: lists, sets, sorted sets, hashes", "Persistence: RDB snapshots or AOF log", "Pub/Sub + native TTL on every key"], when: "Sessions, leaderboards, pub/sub, rate limiting, queues", pricing: "Same ElastiCache pricing. Multi-AZ = 2×. Global Datastore adds cross-region cost." },
      { name: "Global Datastore", full: "ElastiCache Global Datastore", color: "#E8983C", lightBg: "#FEF5ED", icon: "🌍🧠", tagline: "Redis replicated across regions", analogy: "Aurora Global Database but for Redis — cache mirrored to another region for global reads and failover.", keyPoints: ["1 primary + up to 2 secondary regions", "~1 second replication lag", "Secondaries read-only; promote on failover"], when: "Global apps needing low-latency cache; Redis DR across regions", pricing: "Standard ElastiCache per cluster + ~$0.20/GB replicated cross-region." },
      { name: "Redshift", full: "Amazon Redshift", color: "#2E86AB", lightBg: "#EBF5FB", icon: "📊", tagline: "Data warehouse for analytics", analogy: "A giant spreadsheet for analysis — not live transactions, but crunching billions of rows.", keyPoints: ["Columnar storage — fast for aggregations", "Petabyte-scale", "Integrates with Tableau, QuickSight, etc."], when: "BI, analytics, reporting on large historical datasets", pricing: "dc2.large ~$0.25/hr. Reserved 1yr saves ~40%. Serverless ~$0.375/RPU-hr." },
      { name: "Neptune", full: "Amazon Neptune", color: "#9B59B6", lightBg: "#F5EEF8", icon: "🕸️", tagline: "Graph database", analogy: "Great at answering 'who is connected to whom' — social networks, fraud rings, knowledge graphs.", keyPoints: ["Supports Gremlin & SPARQL", "Optimised for relationship traversal", "Fully managed, Multi-AZ"], when: "Social networks, fraud detection, knowledge graphs", pricing: "db.r5.large ~$0.35/hr + $0.10/GB/month storage." },
    ]
  },
  networking: {
    tab: "🌐 Networking",
    items: [
      { name: "VPC", full: "Virtual Private Cloud", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🏰", tagline: "Your private network in AWS", analogy: "Building your own walled city inside AWS — you control who gets in and out.", keyPoints: ["Isolated network environment per account/region", "Public subnets (internet-facing) vs private subnets", "Security Groups + NACLs for layered firewalling"], when: "Always — every AWS resource lives inside a VPC", pricing: "VPC free. Charges for NAT Gateway, VPN, VPC Peering data transfer." },
      { name: "Internet Gateway", full: "Internet Gateway (IGW)", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🌐🚪", tagline: "Allows internet traffic in/out of VPC", analogy: "The main front door of your VPC — without it, nothing inside can talk to the internet and nothing from the internet can reach you.", keyPoints: ["Attached to a VPC (one per VPC)", "Required for public subnets to have internet access", "Horizontally scaled, highly available — no bandwidth limit", "Route table must point 0.0.0.0/0 to the IGW"], when: "Any resource in a public subnet that needs internet access (EC2, ALB, etc.)", pricing: "Free. You pay for data transfer, not the gateway itself." },
      { name: "NAT Gateway", full: "NAT Gateway", color: "#C0392B", lightBg: "#FDEDEC", icon: "🔒🚪", tagline: "Outbound internet for private subnets", analogy: "A one-way door — private resources can make outbound requests to the internet (to download updates, call APIs) but inbound connections from the internet are blocked.", keyPoints: ["Sits in a public subnet; private subnet routes 0.0.0.0/0 to it", "Managed by AWS — highly available within an AZ", "Deploy one per AZ for full HA (cross-AZ NAT costs extra data transfer)"], when: "EC2/Lambda in private subnets needing outbound internet (OS updates, external APIs) without being publicly reachable", pricing: "~$0.045/hr per NAT Gateway + $0.045/GB data processed. Can get expensive at high data volumes." },
      { name: "Security Groups", full: "Security Groups", color: "#E8593C", lightBg: "#FEF0ED", icon: "🧱🔑", tagline: "Stateful firewall for instances", analogy: "A personal bodyguard per server — you define exactly which IPs and ports are allowed in or out.", keyPoints: ["Stateful: allow inbound → response auto-allowed out", "Applied at instance/ENI level", "Default: deny all inbound, allow all outbound"], when: "Always — every EC2, RDS, Lambda in VPC needs one", pricing: "Free." },
      { name: "NACLs", full: "Network Access Control Lists", color: "#7D6608", lightBg: "#FEFCE8", icon: "🔐📋", tagline: "Stateless firewall for subnets", analogy: "A border checkpoint for an entire neighbourhood — must explicitly allow both inbound AND outbound.", keyPoints: ["Stateless: must set both inbound AND outbound rules", "Applied at the subnet level", "Rules evaluated in number order — first match wins"], when: "Extra subnet-level defence, blocking IP ranges", pricing: "Free." },
      { name: "VPC Endpoints", full: "VPC Endpoints", color: "#9B59B6", lightBg: "#F5EEF8", icon: "🔗🏰", tagline: "Private access to AWS services without internet", analogy: "A private tunnel from your VPC directly to S3, DynamoDB, or other AWS services — traffic never leaves the AWS network.", keyPoints: ["Gateway Endpoints: free, for S3 and DynamoDB only", "Interface Endpoints (PrivateLink): for 100+ AWS services, uses an ENI in your subnet", "Eliminates need for NAT Gateway just to reach AWS services"], when: "EC2/Lambda in private subnets accessing S3, DynamoDB, or other AWS services without internet routing", pricing: "Gateway Endpoints: free. Interface Endpoints: ~$0.01/hr per AZ + $0.01/GB data." },
      { name: "VPN", full: "AWS Site-to-Site VPN", color: "#5D6D7E", lightBg: "#F2F3F4", icon: "🔒🌐", tagline: "Encrypted tunnel from on-prem to AWS", analogy: "A secure underground pipe connecting your office to AWS — all traffic is encrypted and travels over the public internet.", keyPoints: ["Encrypted IPsec tunnel between on-prem and VPC", "Faster to set up than Direct Connect (minutes vs weeks)", "Two tunnels per connection for redundancy", "Pair with Direct Connect for encrypted private link"], when: "Secure on-prem to AWS connectivity without paying for Direct Connect", pricing: "$0.05/hr per VPN connection + data transfer." },
      { name: "ELB", full: "Elastic Load Balancing", color: "#E8983C", lightBg: "#FEF5ED", icon: "⚖️", tagline: "Distribute traffic across servers", analogy: "A traffic cop spreading requests evenly. Three types: ALB, NLB, GLB.", keyPoints: ["ALB = Layer 7, HTTP/HTTPS, path/host routing", "NLB = Layer 4, TCP/UDP, ultra-low latency", "GLB = Layer 3, for firewalls & appliances"], when: "Multiple servers handling the same app", pricing: "ALB: ~$0.016/hr + $0.008/LCU-hr. NLB: ~$0.016/hr + $0.006/NLCU-hr." },
      { name: "ALB", full: "Application Load Balancer", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🔀", tagline: "Smart HTTP/HTTPS load balancer", analogy: "A hotel concierge — routes you to the right room (microservice) based on URL path or hostname.", keyPoints: ["Routes by path (/api → A, /web → B) or host", "WebSockets, HTTP/2, gRPC support", "Native container/Lambda targets"], when: "Web apps, APIs, microservices needing content-based routing", pricing: "~$0.016/hr + $0.008/LCU-hr." },
      { name: "NLB", full: "Network Load Balancer", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "⚡⚖️", tagline: "Ultra-fast TCP/UDP load balancer", analogy: "A high-speed toll booth — routes packets as fast as possible without inspecting them.", keyPoints: ["Layer 4 (TCP/UDP/TLS)", "Millions of requests/second", "Static IP per AZ — useful for whitelisting"], when: "Extreme performance, gaming, IoT, static IP requirement", pricing: "~$0.016/hr + $0.006/NLCU-hr." },
      { name: "Route 53", full: "Amazon Route 53", color: "#C0392B", lightBg: "#FDEDEC", icon: "🌍📡", tagline: "DNS & domain management", analogy: "The internet's phone book — translates 'mysite.com' into an IP address.", keyPoints: ["Routing: Simple, Weighted, Latency, Failover, Geolocation", "Health checks trigger automatic failover", "Named after DNS port 53"], when: "Pointing domain names to AWS, global routing, DR failover", pricing: "$0.50/hosted zone/month · $0.40/million queries · Health checks ~$0.50/endpoint/month." },
      { name: "CloudFront", full: "Amazon CloudFront + CDN Caching", color: "#5D6D7E", lightBg: "#F2F3F4", icon: "🌩", tagline: "CDN — cache content at the edge", analogy: "Instead of every user fetching your files from one server in us-east-1, CloudFront places cached copies at 200+ locations worldwide. Paris users get files from Frankfurt, Tokyo users from Tokyo — no ocean crossing.", keyPoints: ["Edge locations cache your content (static files, images, HTML, APIs)", "Cache behaviour set by TTL (Time To Live) — how long content stays at edge before re-fetching from origin", "Cache hit = served from edge instantly. Cache miss = CloudFront fetches from origin, caches it", "Invalidations let you force-clear the cache when content changes", "Origin can be S3, ALB, EC2, or any HTTP endpoint"], when: "Global content delivery; reducing origin server load; protecting S3 with OAC/OAI; HTTPS for S3 static sites", pricing: "~$0.0085–$0.02/GB transfer. 1TB + 10M requests/month free tier." },
      { name: "Lambda@Edge", full: "Lambda@Edge / CloudFront Functions", color: "#7D6608", lightBg: "#FEFCE8", icon: "λ🌩", tagline: "Run code at CloudFront edge", analogy: "A tiny function that intercepts requests or responses at the edge — before they ever reach your origin.", keyPoints: ["Lambda@Edge: full Lambda at regional edge caches", "CloudFront Functions: lightweight JS at all 200+ PoPs, <1ms", "Uses: URL rewrites, auth checks, A/B testing, header injection"], when: "Auth at edge, URL rewrites, personalisation without hitting origin", pricing: "CloudFront Functions: $0.10/million. Lambda@Edge: $0.60/million + compute." },
      { name: "OAC / OAI", full: "Origin Access Control / Identity", color: "#E8983C", lightBg: "#FEF5ED", icon: "🔒🌩", tagline: "Lock S3 to CloudFront only", analogy: "A VIP backstage pass — only CloudFront can access your S3 bucket directly; everyone else is blocked.", keyPoints: ["Prevents direct public access to S3 origin", "OAC is the modern replacement for OAI", "Set in CloudFront + S3 bucket policy"], when: "Serving private S3 content exclusively through CloudFront", pricing: "Free." },
      { name: "Global Accelerator", full: "AWS Global Accelerator", color: "#9B59B6", lightBg: "#F5EEF8", icon: "🏎️", tagline: "Speed up dynamic traffic globally", analogy: "CloudFront caches. Global Accelerator routes — it sends live traffic through AWS's private backbone instead of the slow public internet.", keyPoints: ["2 static anycast IPs globally", "Routes to nearest healthy endpoint", "TCP/UDP — no caching"], when: "Dynamic content, gaming, VoIP, non-HTTP — where caching doesn't apply", pricing: "$0.025/hr per accelerator + $0.015/GB." },
      { name: "API Gateway", full: "Amazon API Gateway", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🚪", tagline: "Front door for your APIs", analogy: "A bouncer — checks requests, enforces rules, routes to the right backend.", keyPoints: ["Rate limiting, auth, throttling built-in", "Pairs with Lambda for serverless APIs", "REST, HTTP, WebSocket APIs"], when: "Exposing Lambda or backends as a public/private API", pricing: "REST: $3.50/million. HTTP: $1.00/million. WebSocket: $1.00/million messages." },
      { name: "Direct Connect", full: "AWS Direct Connect", color: "#C0392B", lightBg: "#FDEDEC", icon: "🔌", tagline: "Dedicated private line to AWS", analogy: "A private cable from your office directly to AWS — no public internet.", keyPoints: ["More reliable & consistent than VPN", "1 Gbps or 10 Gbps speeds", "Pair with VPN for encrypted private link"], when: "Enterprises needing consistent high-bandwidth low-latency AWS access", pricing: "~$0.30/hr (1G) or $2.25/hr (10G). Data out ~$0.02/GB." },
      { name: "Public Subnet", full: "Public Subnet", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🌐🏘️", tagline: "Subnet with a route to the internet", analogy: "The front of house — resources here have a public entrance and can be reached directly from the internet.", keyPoints: ["Route table has 0.0.0.0/0 pointing to an Internet Gateway", "Resources can be assigned public IPs", "Where you place load balancers, bastion hosts, NAT Gateways"], when: "Resources that must be reachable from the internet: ALBs, bastion hosts, NAT Gateways", pricing: "Free. You pay for the resources inside and data transfer." },
      { name: "Private Subnet", full: "Private Subnet", color: "#5D6D7E", lightBg: "#F2F3F4", icon: "🔒🏘️", tagline: "Subnet with no direct internet route", analogy: "The back office — resources here are invisible to the internet. Outbound traffic goes via NAT Gateway; inbound only from within the VPC.", keyPoints: ["No route to Internet Gateway in its route table", "Outbound internet via NAT Gateway placed in a public subnet", "Where you place app servers, databases, Lambda-in-VPC"], when: "Any resource that should not be publicly reachable: EC2 app servers, RDS, ECS tasks", pricing: "Free. NAT Gateway for outbound internet costs ~$0.045/hr + $0.045/GB." },
      { name: "Transit Gateway", full: "AWS Transit Gateway", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🔀🏢", tagline: "Central hub connecting VPCs and on-prem", analogy: "A regional airport — instead of direct flights between every city pair (VPC peering), all routes go through the hub. Add a new city, connect it once.", keyPoints: ["Connects hundreds of VPCs and on-prem networks through one gateway", "Replaces complex full-mesh VPC peering", "Supports cross-region peering and multicast"], when: "Large environments with many VPCs needing to communicate, or connecting multiple VPCs to on-prem", pricing: "$0.05/hr per attachment + $0.02/GB data processed." },
      { name: "PrivateLink", full: "AWS PrivateLink", color: "#9B59B6", lightBg: "#F5EEF8", icon: "🔗🔒", tagline: "Expose your service privately to other VPCs", analogy: "A private delivery hatch — other VPCs or AWS accounts access your service without it ever touching the public internet or requiring VPC peering.", keyPoints: ["Traffic stays on AWS backbone — no internet exposure", "Used by Interface Endpoints to reach AWS services privately", "You can publish your own services via PrivateLink too", "No VPC peering or route table changes needed on consumer side"], when: "Sharing services between VPCs/accounts privately; accessing AWS or SaaS services without internet", pricing: "~$0.01/hr per endpoint per AZ + $0.01/GB data processed." },
      { name: "Interface Endpoint", full: "VPC Interface Endpoint", color: "#E8983C", lightBg: "#FEF5ED", icon: "🔌🏰", tagline: "ENI in your subnet for private AWS service access", analogy: "A private phone line to an AWS service installed inside your subnet — calls go over the AWS backbone, never touching the public internet.", keyPoints: ["Powered by PrivateLink — creates an ENI with a private IP in your subnet", "Supports 100+ services: SSM, Secrets Manager, SQS, SNS, EC2 API…", "Works in private subnets with no internet access at all", "Different from Gateway Endpoints (free, S3/DynamoDB only)"], when: "Resources in private subnets that need to call AWS APIs without routing through NAT Gateway", pricing: "~$0.01/hr per AZ + $0.01/GB. Often cheaper than NAT Gateway at high data volumes." },
    ]
  },
  messaging: {
    tab: "📨 Messaging",
    items: [
      { name: "SQS", full: "Simple Queue Service", color: "#E8593C", lightBg: "#FEF0ED", icon: "💬", tagline: "Message queue — decouple services", analogy: "A to-do list between services — A drops a task, B picks it up when ready.", keyPoints: ["Pull-based (consumers poll)", "Messages retained up to 14 days", "Standard (at-least-once) or FIFO (exactly-once, ordered)"], when: "Decoupling microservices, smoothing traffic spikes, background jobs", pricing: "1M requests/month free · $0.40/million (Standard) · $0.50/million (FIFO)." },
      { name: "SNS", full: "Simple Notification Service", color: "#9B59B6", lightBg: "#F5EEF8", icon: "📢", tagline: "Pub/sub notifications — fan out", analogy: "A megaphone — one message broadcast to all subscribers simultaneously.", keyPoints: ["Push-based (AWS delivers)", "One message → many receivers", "Subscribers: Lambda, SQS, HTTP, email, SMS"], when: "Fan-out patterns, alerting multiple systems, notifications", pricing: "1M publishes free · $0.50/million after · SMS ~$0.00645/message." },
      { name: "EventBridge", full: "Amazon EventBridge", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🚌", tagline: "Serverless event bus", analogy: "A smart router — listens for events across AWS or SaaS and routes based on rules.", keyPoints: ["Routes from AWS services + SaaS (Zendesk, Shopify…)", "Scheduled rules replace cron jobs", "Schema registry for event discovery"], when: "Event-driven workflows, SaaS integrations, cron replacement", pricing: "$1.00/million custom events. AWS events free. Scheduled: $1.00/million." },
      { name: "Kinesis", full: "Amazon Kinesis", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🌊", tagline: "Real-time data streaming", analogy: "A river of data — continuous high-volume streams processed in real time.", keyPoints: ["Data Streams = real-time ingestion & replay", "Firehose = auto-load into S3/Redshift/OpenSearch", "Analytics = SQL on live streams"], when: "Real-time analytics, IoT telemetry, clickstream analysis", pricing: "Streams: $0.015/shard-hr + $0.014/million records. Firehose: $0.029/GB." },
    ]
  },
  security: {
    tab: "🔒 Security",
    items: [
      { name: "IAM", full: "Identity & Access Management", color: "#E8593C", lightBg: "#FEF0ED", icon: "🪪", tagline: "Who can do what in AWS", analogy: "A keycard system — each person/service gets a card that only opens allowed doors.", keyPoints: ["Users, Groups, Roles, Policies (JSON)", "Principle of least privilege", "Roles for services — no hardcoded credentials"], when: "Always — every AWS account uses IAM", pricing: "Free." },
      { name: "SSO / IAM Identity Center", full: "AWS IAM Identity Center (SSO)", color: "#9B59B6", lightBg: "#F5EEF8", icon: "🔑👥", tagline: "Single sign-on across AWS accounts and apps", analogy: "A master key — one login gives you access to all your AWS accounts and business apps (Salesforce, Slack, etc.) without re-entering credentials.", keyPoints: ["One login to access multiple AWS accounts in AWS Organizations", "Integrates with Azure AD, Okta, Google Workspace (SAML/OIDC)", "Replaces manually managing IAM users in each account", "Supports permission sets for role-based access"], when: "Multiple AWS accounts, enterprise SSO, replacing per-account IAM users", pricing: "Free for AWS managed accounts. External IdP integrations are free too." },
      { name: "KMS", full: "Key Management Service", color: "#C0392B", lightBg: "#FDEDEC", icon: "🔐", tagline: "Manage encryption keys", analogy: "A secure bank vault for encryption keys — controls who can use them to lock or unlock data.", keyPoints: ["CMK: you control rotation & policy", "AWS-managed keys: automatic, free", "Envelope encryption: KMS encrypts a data key, data key encrypts your data"], when: "Encrypting S3, EBS, RDS, DynamoDB, Lambda, etc.", pricing: "$1/month per CMK · $0.03/10,000 API calls. AWS-managed keys free." },
      { name: "Secrets Manager", full: "AWS Secrets Manager", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🤫", tagline: "Store & rotate secrets securely", analogy: "A locked vault — apps fetch passwords at runtime instead of hardcoding in source code.", keyPoints: ["DB passwords, API keys, tokens", "Auto-rotates on schedule", "Fine-grained IAM access per secret"], when: "Any secret that shouldn't be in code or env vars", pricing: "$0.40/secret/month · $0.05/10,000 API calls." },
      { name: "WAF", full: "AWS Web Application Firewall", color: "#7D6608", lightBg: "#FEFCE8", icon: "🧱", tagline: "Block malicious web traffic", analogy: "A bouncer — inspects HTTP requests and blocks SQLi, XSS, bad bots before they reach your app.", keyPoints: ["Blocks OWASP Top 10: SQLi, XSS, bad IPs", "Attaches to CloudFront, ALB, API Gateway", "Managed rule groups available"], when: "Protecting public web apps from common attacks", pricing: "$5/Web ACL/month + $1/rule/month + $0.60/million requests." },
      { name: "Shield", full: "AWS Shield", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🛡️", tagline: "DDoS protection", analogy: "A flood barrier — absorbs volumetric attacks before they knock your app offline.", keyPoints: ["Standard: free, automatic, always-on", "Advanced: $3,000/month, L7 protection, 24/7 DRT", "Protects EC2, ELB, CloudFront, Route 53"], when: "Standard always on. Advanced for high-value targets.", pricing: "Standard: free. Advanced: $3,000/month per organisation." },
      { name: "GuardDuty", full: "Amazon GuardDuty", color: "#E8983C", lightBg: "#FEF5ED", icon: "🕵️", tagline: "Intelligent threat detection", analogy: "A security camera with AI — watches for suspicious behaviour, no agents needed.", keyPoints: ["Analyses CloudTrail, VPC Flow Logs, DNS logs", "Detects: crypto mining, credential theft, port scanning", "One-click enable — fully managed"], when: "Continuous threat monitoring across your AWS account", pricing: "~$4/million CloudTrail events + $0.10–$0.80/GB VPC logs. 30-day trial." },
      { name: "Inspector", full: "Amazon Inspector", color: "#5D6D7E", lightBg: "#F2F3F4", icon: "🔍", tagline: "Automated vulnerability scanning", analogy: "A health inspector — scans for known CVEs and network exposure on EC2 and containers.", keyPoints: ["Scans EC2, Lambda, ECR container images", "Continuous, severity-ranked findings", "No agents for EC2 (uses SSM)"], when: "Finding vulnerabilities before attackers do", pricing: "EC2: ~$0.111/instance/month · ECR: ~$0.09/image/month." },
      { name: "Cognito", full: "Amazon Cognito", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🤝", tagline: "User sign-up, sign-in & auth", analogy: "A ready-made login system — registration, passwords, MFA, social login out of the box.", keyPoints: ["User Pools = user directory", "Identity Pools = grant AWS access to users", "OAuth 2.0, SAML, social login"], when: "Adding auth to web/mobile apps without building it", pricing: "50k MAUs free · $0.0055/MAU after." },
      { name: "ACM", full: "AWS Certificate Manager", color: "#C0392B", lightBg: "#FDEDEC", icon: "📜", tagline: "Free SSL/TLS certificates", analogy: "A free, auto-renewing padlock for your website — HTTPS without managing cert renewals.", keyPoints: ["Free public certs for CloudFront, ALB, API Gateway", "Auto-renews before expiry", "Private CA for internal certs"], when: "HTTPS on any AWS-hosted website or API", pricing: "Public certs: free. Private CA: $400/month + $0.75/cert." },
      { name: "CloudTrail", full: "AWS CloudTrail", color: "#7D6608", lightBg: "#FEFCE8", icon: "📋", tagline: "Audit log of all AWS API calls", analogy: "A CCTV recording of everything in your account — who did what, when, from where.", keyPoints: ["Logs every API call across all services", "90 days free; send to S3 for long-term", "Essential for compliance & forensics"], when: "Audits, security investigations, 'who deleted that?'", pricing: "One free trail/region. Extra trails: $2/100k management events." },
      { name: "Macie", full: "Amazon Macie", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🔎", tagline: "Find sensitive data in S3", analogy: "A data scanner that flags files containing credit cards, SSNs, or passwords in your S3 buckets.", keyPoints: ["ML-powered PII/sensitive data discovery", "Scans S3 for PII, credentials, financials", "Integrates with Security Hub & EventBridge"], when: "GDPR/HIPAA audits, finding accidentally exposed PII", pricing: "$1/bucket/month + $1/GB scanned. 30-day trial." },
      { name: "Security Hub", full: "AWS Security Hub", color: "#E8983C", lightBg: "#FEF5ED", icon: "🏛️", tagline: "Centralised security dashboard", analogy: "One pane of glass — aggregates findings from GuardDuty, Inspector, Macie, WAF into one prioritised view.", keyPoints: ["50+ AWS & partner integrations", "Automated CIS, PCI-DSS, NIST compliance checks", "EventBridge integration for remediation"], when: "Managing security posture across many services or accounts", pricing: "$0.0010/finding/month + $0.0008/security check. 30-day trial." },
    ]
  },
  monitoring: {
    tab: "📡 Monitoring",
    items: [
      { name: "CloudWatch", full: "Amazon CloudWatch", color: "#E8593C", lightBg: "#FEF0ED", icon: "📊", tagline: "Metrics, logs & alarms for AWS", analogy: "Your infrastructure dashboard — metrics, logs, and alert system in one place.", keyPoints: ["Collects metrics from all AWS services", "Custom metrics from your own apps", "Alarms trigger SNS, Lambda, Auto Scaling"], when: "Monitoring resource health, threshold alerts, dashboards", pricing: "Basic (5-min) free. Detailed (1-min): ~$0.01/metric/month. Custom: $0.30/metric/month." },
      { name: "CloudWatch Logs", full: "CloudWatch Logs", color: "#C0392B", lightBg: "#FDEDEC", icon: "📝", tagline: "Centralised log storage & search", analogy: "A searchable filing cabinet for all your logs — no more SSHing into servers.", keyPoints: ["Ingests from EC2, Lambda, ECS, RDS, etc.", "Log Insights: SQL-like queries", "Metric filters: log patterns → CloudWatch alarms"], when: "Centralising logs, debugging errors, compliance retention", pricing: "$0.50/GB ingested · $0.03/GB stored/month." },
      { name: "X-Ray", full: "AWS X-Ray", color: "#9B59B6", lightBg: "#F5EEF8", icon: "🔬", tagline: "Distributed tracing for apps", analogy: "An X-ray machine for microservices — shows exactly where a request went and where it broke.", keyPoints: ["Traces across Lambda, EC2, API Gateway, SQS", "Visual service dependency map", "Identifies latency and error sources"], when: "Debugging latency and errors in distributed systems", pricing: "100k traces/month free · $5/million recorded." },
      { name: "Config", full: "AWS Config", color: "#2E86AB", lightBg: "#EBF5FB", icon: "📐", tagline: "Track resource configuration changes", analogy: "A time machine for your AWS settings — see what changed and when.", keyPoints: ["Continuous recording of resource configs", "Rules flag non-compliant resources", "Pair with CloudTrail for full audit trail"], when: "Compliance, drift detection, config history", pricing: "$0.003/config item · $1/active rule/month." },
      { name: "AWS Budgets", full: "AWS Budgets", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "💸", tagline: "Set spending alerts and thresholds", analogy: "A smoke alarm for your AWS bill — alerts you when spend is approaching or exceeding your budget before the bill arrives.", keyPoints: ["Set budgets by cost, usage, RI coverage, or Savings Plan utilisation", "Alert via email or SNS when threshold hit (e.g. 80%, 100%)", "Budget Actions: auto-apply IAM policy or stop EC2/RDS if budget exceeded", "View forecasted spend vs actual"], when: "Preventing surprise bills, enforcing cost guardrails, tracking per-team or per-project spend", pricing: "First 2 budgets free. $0.02/day per budget after ($0.60/month)." },
      { name: "Trusted Advisor", full: "AWS Trusted Advisor", color: "#7D6608", lightBg: "#FEFCE8", icon: "💡", tagline: "Automated best-practice recommendations", analogy: "A consultant who flags open S3 buckets, underused resources, security gaps, and limit risks.", keyPoints: ["Checks: cost, performance, security, fault tolerance, limits", "Core checks free; full access needs Business/Enterprise support", "CloudWatch integration for proactive alerts"], when: "Periodic account health checks, cost optimisation", pricing: "~7 core checks free. Full 400+ checks need Business support ($100/month min)." },
      { name: "CloudWatch Agent", full: "CloudWatch Agent", color: "#E8983C", lightBg: "#FEF5ED", icon: "🦾📊", tagline: "Collect OS-level metrics from EC2", analogy: "A reporter on your EC2 — sends memory, disk, and process metrics CloudWatch can't see by default.", keyPoints: ["Memory, disk, swap — not in default EC2 metrics", "Collects OS log files too", "Deploy via SSM or manually"], when: "Need memory/disk metrics from EC2 instances", pricing: "Agent free. Custom metrics sent: $0.30/metric/month." },
    ]
  },
  pricing: {
    tab: "💰 Pricing",
    items: [
      { name: "On-Demand", full: "On-Demand Pricing", color: "#E8593C", lightBg: "#FEF0ED", icon: "💳", tagline: "Pay as you go, no commitment", analogy: "Renting a car by the hour — maximum flexibility, highest price per unit.", keyPoints: ["No upfront cost, no commitment", "Pay per second/hour", "Best for unpredictable or short-term workloads"], when: "Starting out, unpredictable traffic, anything you can't commit to", pricing: "Full price. Baseline to compare all models against." },
      { name: "Reserved", full: "Reserved Instances", color: "#9B59B6", lightBg: "#F5EEF8", icon: "📅", tagline: "1–3 year commitment, up to 72% off", analogy: "Signing a 1–3 year lease — cheaper per month but you're locked in.", keyPoints: ["1yr or 3yr term (3yr = bigger discount)", "All Upfront > Partial > No Upfront", "Applies to EC2, RDS, ElastiCache, Redshift"], when: "Steady-state production workloads running 1+ years", pricing: "Up to 72% off (3yr All Upfront). Convertible RIs: up to 54%, more flexible." },
      { name: "Savings Plans", full: "AWS Savings Plans", color: "#2E86AB", lightBg: "#EBF5FB", icon: "💰", tagline: "Flexible $/hr commitment — up to 72% off", analogy: "A monthly phone plan — commit to $X/hr of compute spend, get a discount across whatever you use.", keyPoints: ["Compute Plans: EC2 + Lambda + Fargate — most flexible", "EC2 Instance Plans: bigger discount, locked to family + region", "1 or 3-year term"], when: "Like RIs but want flexibility to change instance types or services", pricing: "Up to 66% (Compute) or 72% (EC2 Instance) off On-Demand." },
      { name: "Spot Instances", full: "EC2 Spot Instances", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🎲", tagline: "Spare EC2 capacity — up to 90% off", analogy: "Standby airline seats — incredibly cheap but you can be bumped with 2 minutes notice.", keyPoints: ["Up to 90% below On-Demand", "2-min interruption warning", "Best for fault-tolerant, stateless workloads"], when: "Batch jobs, big data, ML training — anything interruptible", pricing: "Fluctuates with demand. Typically 70–90% below On-Demand." },
      { name: "Free Tier", full: "AWS Free Tier", color: "#7D6608", lightBg: "#FEFCE8", icon: "🎁", tagline: "Free usage to learn and experiment", analogy: "A free sample — meaningful amounts of each service to try before you buy.", keyPoints: ["Always Free: 1M Lambda req/mo, 25GB DynamoDB — forever", "12 Months: 750hrs EC2 t2.micro, 5GB S3, 750hrs RDS", "Trial: 30-day trials for newer services"], when: "Learning, prototyping, small personal projects", pricing: "Free within limits. Overage billed at standard rates — watch carefully." },
      { name: "Data Transfer", full: "Data Transfer Pricing", color: "#C0392B", lightBg: "#FDEDEC", icon: "🔄", tagline: "Moving data costs money — know the rules", analogy: "Storing water is cheap, but piping it outside your house costs money — especially internationally.", keyPoints: ["FREE: data IN from internet; within same AZ via private IPs", "CHARGED: out to internet (~$0.09/GB); cross-AZ (~$0.01/GB); cross-region (~$0.02/GB)", "CloudFront reduces egress significantly vs direct EC2/S3"], when: "Architecture decisions — use same AZ, VPC Endpoints, CloudFront to minimise egress", pricing: "Internet out: $0.09/GB. Cross-AZ: $0.01/GB each way. Cross-region: ~$0.02/GB." },
      { name: "AWS Budgets", full: "AWS Budgets", color: "#5D6D7E", lightBg: "#F2F3F4", icon: "💸", tagline: "Set spending alerts and guardrails", analogy: "A smoke alarm for your bill — alerts before the surprise arrives, and can automatically stop resources if budget is blown.", keyPoints: ["Alert at 80%, 100% of budget via email or SNS", "Budget Actions: auto-apply IAM deny policy or stop EC2/RDS", "Track actual vs forecast spend", "First 2 budgets free"], when: "Preventing surprise bills; per-team or per-project cost control", pricing: "First 2 budgets free. $0.02/day per budget after." },
      { name: "Cost Explorer", full: "AWS Cost Explorer", color: "#E8983C", lightBg: "#FEF5ED", icon: "📈", tagline: "Visualise and analyse your actual spend", analogy: "Your AWS bank statement with graphs — see where money is going and spot waste.", keyPoints: ["Visualise by service, region, tag, account", "EC2 rightsizing recommendations", "Forecasts future spend from trends"], when: "Reviewing your bill, finding waste, RI purchase decisions", pricing: "$0.01/API request (console use free)." },
      { name: "Pricing Calculator", full: "AWS Pricing Calculator", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🧮", tagline: "Estimate your bill before you build", analogy: "A quote tool — configure planned services, get a monthly estimate before committing.", keyPoints: ["Free at calculator.aws", "Estimate service by service", "Export and share with team"], when: "Planning projects, justifying spend, comparing architectures", pricing: "Free to use at calculator.aws" },
    ]
  },
  ai: {
    tab: "🤖 AI / ML",
    items: [
      { name: "SageMaker", full: "Amazon SageMaker", color: "#E8593C", lightBg: "#FEF0ED", icon: "🧠⚙️", tagline: "End-to-end ML platform", analogy: "A fully equipped ML lab — data prep benches, training rigs, and a deployment line all in one building. You bring the idea, AWS provides every tool.", keyPoints: ["Build, train, and deploy ML models at scale", "Managed Jupyter notebooks (Studio) for experimentation", "Built-in algorithms + bring your own; auto-scales training jobs", "SageMaker Endpoint for real-time inference; Batch Transform for bulk scoring"], when: "Any ML workload: training custom models, running inference endpoints, AutoML with Autopilot", pricing: "ml.t3.medium notebook ~$0.05/hr. Training: ml.m5.xlarge ~$0.23/hr. Inference endpoint varies by instance." },
      { name: "Comprehend", full: "Amazon Comprehend", color: "#9B59B6", lightBg: "#F5EEF8", icon: "📖🤖", tagline: "NLP — understand text at scale", analogy: "A speed-reader with a psychology degree — it scans text and tells you the sentiment, who/what is mentioned, what language it's in, and what topics it covers.", keyPoints: ["Sentiment analysis: positive / negative / neutral / mixed", "Entity recognition: people, places, dates, organisations", "Key phrase extraction, language detection, topic modelling", "Custom classifiers and entity recognisers you can train on your data"], when: "Analysing customer reviews, support tickets, social media; document classification; compliance scanning", pricing: "NLP units (100 chars = 1 unit). Sentiment: $0.0001/unit. Custom model training: $3/hr." },
      { name: "Transcribe", full: "Amazon Transcribe", color: "#2E86AB", lightBg: "#EBF5FB", icon: "🎙️📝", tagline: "Speech to text — audio/video → transcript", analogy: "A tireless court reporter — feed it an audio file or a live stream and it types out everything said, with speaker labels and timestamps.", keyPoints: ["Batch transcription (upload file) or streaming (real-time)", "Speaker diarisation: labels who said what", "Custom vocabulary for domain-specific jargon", "Redaction: auto-removes PII like card numbers from transcripts"], when: "Call centre analytics, meeting transcription, video captioning, voice-driven search", pricing: "Standard: $0.024/minute. Streaming: $0.018/minute. First 60 min/month free for 12 months." },
      { name: "Lookout", full: "Amazon Lookout for Metrics", color: "#1A7A4A", lightBg: "#EAFAF1", icon: "🔭📉", tagline: "Automated anomaly detection for metrics", analogy: "A tireless analyst watching all your dashboards — it learns what 'normal' looks like for each metric and pages you the moment something unusual happens, with a root-cause explanation.", keyPoints: ["Ingests metrics from S3, Redshift, RDS, CloudWatch, or SaaS (Salesforce, Marketo…)", "No ML expertise needed — fully automated model training and updating", "Groups related anomalies together and ranks by severity", "Variants: Lookout for Vision (image defects), Lookout for Equipment (sensor data)"], when: "Business metric monitoring (revenue drops, ad CTR spikes), IoT sensor anomaly detection, image quality inspection", pricing: "Up to 5 metrics free/month. Additional: $0.30/metric/month up to 5k, lower tiers after." },
    ]
  },
};

const compareData = {
  compute: [
    { label: "Full VM", service: "EC2", note: "You manage OS & software" },
    { label: "Clone an EC2 environment", service: "AMI", note: "Pre-baked image to stamp out instances" },
    { label: "Run code only", service: "Lambda", note: "No servers at all" },
    { label: "Scale EC2 fleet automatically", service: "Auto Scaling", note: "Min/desired/max — pairs with ELB" },
    { label: "Docker (AWS style)", service: "ECS", note: "AWS-native orchestration" },
    { label: "Docker (industry standard)", service: "EKS", note: "Kubernetes managed by AWS" },
    { label: "Docker, no servers", service: "Fargate", note: "Pairs with ECS or EKS" },
    { label: "Just deploy my app", service: "Beanstalk", note: "Platform-as-a-Service feel" },
  ],
  storage: [
    { label: "Frequent access", service: "S3 Standard", note: "Default — no retrieval fee" },
    { label: "Infrequent access, multi-AZ", service: "S3 IA", note: "Cheaper storage, pay to retrieve" },
    { label: "Infrequent access, single AZ", service: "S3 One Zone-IA", note: "20% cheaper, one AZ only" },
    { label: "Unpredictable access patterns", service: "Intelligent-Tiering", note: "Auto-moves to cheapest tier" },
    { label: "Archive, instant retrieval", service: "Glacier Instant", note: "Cheap + ms access, 90-day min" },
    { label: "Archive, minutes–hours", service: "Glacier Flexible", note: "Expedited/Standard/Bulk" },
    { label: "Cheapest long-term archive", service: "Glacier Deep Archive", note: "~$0.001/GB/mo, 12hr retrieval" },
    { label: "Auto-move/delete objects", service: "S3 Lifecycle", note: "Rules based on age, prefix, or tags" },
    { label: "Speed up global S3 uploads", service: "S3 Transfer Acceleration", note: "CloudFront edge as upload on-ramp" },
    { label: "Shared file system (multi-EC2)", service: "EFS", note: "NFS, auto-scales, cross-AZ" },
    { label: "Centralised backups", service: "AWS Backup", note: "Policy-driven, covers all services" },
    { label: "On-prem → AWS", service: "Storage Gateway", note: "Hybrid cloud bridge" },
    { label: "Windows / HPC files", service: "FSx", note: "Managed file system" },
  ],
  ebs: [
    { label: "Default — most workloads", service: "gp3 (SSD)", note: "3k IOPS free, independently scalable" },
    { label: "Legacy general SSD", service: "gp2 (SSD)", note: "IOPS tied to size — migrate to gp3" },
    { label: "Highest-performance DB", service: "io2 Block Express", note: "Up to 256k IOPS, sub-ms latency" },
    { label: "High IOPS (older)", service: "io1 (SSD)", note: "Same cost as io2 — io2 is better" },
    { label: "Big data / log processing", service: "st1 (HDD)", note: "High throughput, sequential, cheap" },
    { label: "Cold / rarely accessed data", service: "sc1 (HDD)", note: "Cheapest EBS ~$0.015/GB/month" },
    { label: "Back up a volume", service: "EBS Snapshots", note: "Incremental, cross-region capable" },
    { label: "Understand IOPS vs throughput", service: "I/O Operations", note: "IOPS = random; throughput = sequential" },
  ],
  databases: [
    { label: "Standard SQL", service: "RDS", note: "Managed MySQL/Postgres/etc." },
    { label: "High-performance SQL", service: "Aurora", note: "Faster + scales better than RDS" },
    { label: "SQL across regions / DR", service: "Aurora Global DB", note: "Sub-second replication, ~1min failover" },
    { label: "Staying up / recovering fast", service: "HA / DR", note: "Multi-AZ = HA; Multi-Region = DR" },
    { label: "Massive scale, no SQL", service: "DynamoDB", note: "Key-value, ms latency" },
    { label: "Cache for DynamoDB specifically", service: "DAX", note: "Microsecond latency, drop-in API" },
    { label: "Auto-expire stale data", service: "TTL", note: "DynamoDB + Redis/ElastiCache" },
    { label: "General cache layer", service: "ElastiCache", note: "Redis or Memcached" },
    { label: "Cache with rich data types", service: "Redis", note: "Lists, sets, pub/sub, TTL, persistence" },
    { label: "Cache replicated globally", service: "Global Datastore", note: "Redis across regions" },
    { label: "Analytics on big data", service: "Redshift", note: "Data warehouse, not transactional" },
    { label: "Relationships / graphs", service: "Neptune", note: "Social networks, fraud detection" },
  ],
  networking: [
    { label: "Private network in AWS", service: "VPC", note: "Foundation of every deployment" },
    { label: "Internet access for public subnet", service: "Internet Gateway", note: "The VPC's front door — free" },
    { label: "Outbound internet for private subnet", service: "NAT Gateway", note: "One-way door — costly at high volume" },
    { label: "Private AWS service access (no internet)", service: "VPC Endpoints", note: "Gateway (free for S3/DynamoDB) or Interface" },
    { label: "Encrypted on-prem tunnel", service: "VPN", note: "Over internet, fast to set up, $0.05/hr" },
    { label: "Dedicated on-prem connection", service: "Direct Connect", note: "Private, consistent, expensive" },
    { label: "Instance-level firewall", service: "Security Groups", note: "Stateful — free" },
    { label: "Subnet-level firewall", service: "NACLs", note: "Stateless — must set both directions" },
    { label: "Spread HTTP/HTTPS traffic", service: "ALB", note: "Layer 7, path-based routing" },
    { label: "Spread TCP/UDP traffic", service: "NLB", note: "Layer 4, millions of req/sec" },
    { label: "Domain names / DNS", service: "Route 53", note: "Points URLs to resources + failover" },
    { label: "Cache content globally (CDN)", service: "CloudFront", note: "Edge caching, 200+ locations" },
    { label: "Code at the edge", service: "Lambda@Edge", note: "Auth, rewrites, personalisation" },
    { label: "Lock S3 to CloudFront", service: "OAC / OAI", note: "Prevent direct public S3 access" },
    { label: "Speed up live dynamic traffic", service: "Global Accelerator", note: "AWS backbone, no caching" },
    { label: "Expose an API", service: "API Gateway", note: "Pairs great with Lambda" },
    { label: "Resources need internet access", service: "Public Subnet", note: "Has IGW route; place ALBs, NAT GWs here" },
    { label: "Resources should stay private", service: "Private Subnet", note: "No IGW route; use NAT GW for outbound" },
    { label: "Connect many VPCs + on-prem", service: "Transit Gateway", note: "Hub-and-spoke; replaces full-mesh peering" },
    { label: "Share a service privately across VPCs", service: "PrivateLink", note: "No internet, no peering needed" },
    { label: "Private access to AWS APIs (no NAT)", service: "Interface Endpoint", note: "ENI in subnet via PrivateLink" },
  ],
  messaging: [
    { label: "Decouple two services", service: "SQS", note: "Queue, consumer pulls when ready" },
    { label: "Broadcast to many", service: "SNS", note: "Pub/sub, push to all subscribers" },
    { label: "Route AWS/SaaS events", service: "EventBridge", note: "Rules-based event bus" },
    { label: "Real-time data streaming", service: "Kinesis", note: "High-volume continuous streams" },
    { label: "Fan-out to queues", service: "SNS + SQS", note: "SNS topic → multiple SQS queues" },
    { label: "Replace a cron job", service: "EventBridge", note: "Scheduled rules, no server" },
  ],
  security: [
    { label: "Control who can do what", service: "IAM", note: "Users, Roles, Policies" },
    { label: "Single sign-on / multiple accounts", service: "SSO / IAM Identity Center", note: "One login for all accounts + SaaS apps" },
    { label: "Encrypt data at rest", service: "KMS", note: "Manage keys for S3, EBS, RDS, etc." },
    { label: "Store passwords / API keys", service: "Secrets Manager", note: "Auto-rotates, never hardcode" },
    { label: "Block web attacks", service: "WAF", note: "SQLi, XSS — CloudFront/ALB" },
    { label: "Block DDoS", service: "Shield", note: "Standard free; Advanced $3k/mo" },
    { label: "Detect suspicious activity", service: "GuardDuty", note: "AI-driven, no agents" },
    { label: "Scan for vulnerabilities", service: "Inspector", note: "EC2, Lambda, containers" },
    { label: "Find PII in S3", service: "Macie", note: "Sensitive data discovery" },
    { label: "Unified security dashboard", service: "Security Hub", note: "Aggregates all findings" },
    { label: "Add login to your app", service: "Cognito", note: "User Pools + Identity Pools" },
    { label: "HTTPS certificates", service: "ACM", note: "Free, auto-renewing SSL/TLS" },
    { label: "Audit who did what", service: "CloudTrail", note: "Full API call history" },
  ],
  monitoring: [
    { label: "Monitor metrics & alarms", service: "CloudWatch", note: "Core observability service" },
    { label: "Centralise & search logs", service: "CloudWatch Logs", note: "All service logs in one place" },
    { label: "Memory/disk from EC2", service: "CloudWatch Agent", note: "Not in default metrics" },
    { label: "Trace requests across services", service: "X-Ray", note: "Find latency & errors" },
    { label: "Track config changes", service: "Config", note: "Compliance + drift detection" },
    { label: "Prevent surprise bills", service: "AWS Budgets", note: "Alerts + auto-actions on overspend" },
    { label: "Best-practice recommendations", service: "Trusted Advisor", note: "Cost, security, performance" },
    { label: "Auto-fix from alarms", service: "EventBridge", note: "Alarm → EventBridge → Lambda" },
  ],
  pricing: [
    { label: "Unpredictable / short-term", service: "On-Demand", note: "Full price, no commitment" },
    { label: "Steady workload, 1–3 years", service: "Reserved", note: "Up to 72% off" },
    { label: "Flexible commitment", service: "Savings Plans", note: "Up to 72% off, more flexible" },
    { label: "Fault-tolerant batch jobs", service: "Spot Instances", note: "Up to 90% off, interruptible" },
    { label: "Learning / prototyping", service: "Free Tier", note: "750hrs EC2, 1M Lambda, 25GB DynamoDB" },
    { label: "Reduce data egress", service: "Data Transfer", note: "Same AZ free; use CloudFront/VPC Endpoints" },
    { label: "Prevent surprise bills", service: "AWS Budgets", note: "Alerts + auto-actions at threshold" },
    { label: "Analyse actual spend", service: "Cost Explorer", note: "Spot waste, forecast, rightsizing" },
    { label: "Plan before you build", service: "Pricing Calculator", note: "calculator.aws — free tool" },
  ],
  ai: [
    { label: "Build / train / deploy ML models", service: "SageMaker", note: "End-to-end managed ML platform" },
    { label: "Analyse sentiment or entities in text", service: "Comprehend", note: "NLP — no ML expertise needed" },
    { label: "Convert audio or video to text", service: "Transcribe", note: "Batch or real-time streaming" },
    { label: "Detect anomalies in business metrics", service: "Lookout", note: "Auto-learns normal; alerts on spikes/drops" },
  ],
};

const tabs = Object.entries(data).map(([key, val]) => ({ key, label: val.tab }));

export default function App() {
  const [tab, setTab] = useState("compute");
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("cards");

  const list = data[tab].items;
  const compare = compareData[tab];

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 720, margin: "0 auto", padding: "16px 12px" }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setSelected(null); }}
            style={{
              padding: "5px 10px", borderRadius: 20, border: "1px solid var(--color-border-secondary)",
              background: tab === t.key ? "var(--color-text-primary)" : "transparent",
              color: tab === t.key ? "var(--color-background-primary)" : "var(--color-text-secondary)",
              cursor: "pointer", fontSize: 11, fontWeight: 500,
            }}>
            {t.label}
          </button>
        ))}
        <div style={{ display: "flex", gap: 5, alignItems: "center", marginLeft: "auto" }}>
          {["cards", "compare"].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{
                padding: "5px 10px", borderRadius: 20, border: "1px solid var(--color-border-secondary)",
                background: view === v ? "var(--color-background-secondary)" : "transparent",
                color: view === v ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
                cursor: "pointer", fontSize: 11,
              }}>
              {v === "cards" ? "Cards" : "Compare"}
            </button>
          ))}
        </div>
      </div>

      {view === "compare" ? (
        <div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 12 }}>Match your situation to the right service.</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border-secondary)" }}>
                {["Your situation", "Use", "Why"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--color-text-secondary)", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--color-border-tertiary)", background: i % 2 === 0 ? "transparent" : "var(--color-background-secondary)" }}>
                  <td style={{ padding: "9px 10px", color: "var(--color-text-primary)" }}>{row.label}</td>
                  <td style={{ padding: "9px 10px" }}>
                    <span style={{ fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{row.service}</span>
                  </td>
                  <td style={{ padding: "9px 10px", color: "var(--color-text-secondary)" }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10 }}>
            {list.map(svc => (
              <div key={svc.name} onClick={() => setSelected(selected?.name === svc.name ? null : svc)}
                style={{
                  border: `1.5px solid ${selected?.name === svc.name ? svc.color : "var(--color-border-tertiary)"}`,
                  borderRadius: 12, padding: "11px 13px", cursor: "pointer",
                  background: selected?.name === svc.name ? svc.lightBg : "var(--color-background-secondary)",
                  transition: "all 0.15s",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                  <span style={{ fontSize: 17 }}>{svc.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: svc.color }}>{svc.name}</span>
                </div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 3 }}>{svc.full}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>{svc.tagline}</div>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ marginTop: 14, borderRadius: 14, border: `1.5px solid ${selected.color}`, background: selected.lightBg, padding: "15px 17px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: 20 }}>{selected.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 16, color: selected.color, marginLeft: 8 }}>{selected.name}</span>
                  <span style={{ fontSize: 11, color: "#666", marginLeft: 8 }}>{selected.full}</span>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#999" }}>✕</button>
              </div>
              <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: "#888", marginBottom: 5 }}>The analogy</div>
                  <div style={{ fontSize: 12, color: "#333", lineHeight: 1.6, fontStyle: "italic" }}>"{selected.analogy}"</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: "#888", marginBottom: 5 }}>Key facts</div>
                  {selected.keyPoints.map((p, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#444", marginBottom: 4, display: "flex", gap: 6 }}>
                      <span style={{ color: selected.color, flexShrink: 0 }}>•</span> {p}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 9, background: "rgba(0,0,0,0.04)", borderRadius: 8, padding: "8px 11px" }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: "#888" }}>Use when: </span>
                <span style={{ fontSize: 12, color: "#333" }}>{selected.when}</span>
              </div>
              <div style={{ marginTop: 7, background: "rgba(0,0,0,0.04)", borderRadius: 8, padding: "8px 11px" }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: "#888" }}>💰 Pricing: </span>
                <span style={{ fontSize: 12, color: "#333" }}>{selected.pricing}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
