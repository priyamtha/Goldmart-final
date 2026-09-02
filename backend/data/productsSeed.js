const seedProducts = [
  {
    _id: '65d1a1b2c3d4e5f678901001',
    name: 'Royal Heritage 22K Gold Bridal Choker Necklace',
    category: 'Necklaces',
    purity: '22K',
    weightGrams: 42.5,
    makingChargePerGram: 550,
    gstPercentage: 3,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'
    ],
    description: 'Masterpiece 22K Gold Royal Heritage Choker featuring intricate filigree work, BIS 916 Hallmarked, handcrafted by traditional goldsmiths.',
    inStock: true,
    stockQuantity: 5,
    hallmarkCertified: true,
    bisCode: 'HM-GOLD-916-2026',
    ratings: 4.9,
    numReviews: 28,
    reviews: [
      {
        userName: 'Ananya Sharma',
        rating: 5,
        comment: 'Exquisite craftsmanship! The hallmark tag was verified easily.',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
      }
    ]
  },
  {
    _id: '65d1a1b2c3d4e5f678901002',
    name: 'Solitaire Cushion Cut Diamond 18K Rose Gold Ring',
    category: 'Rings',
    purity: '18K',
    weightGrams: 6.8,
    makingChargePerGram: 600,
    gstPercentage: 3,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800'
    ],
    description: 'Certified VVS1 Clarity 1.2 Carat Diamond mounted on a polished 18K Rose Gold band. Perfect for engagements.',
    inStock: true,
    stockQuantity: 8,
    hallmarkCertified: true,
    bisCode: 'HM-DIA-750-88',
    ratings: 5.0,
    numReviews: 19,
    reviews: [
      {
        userName: 'Vikram Malhotra',
        rating: 5,
        comment: 'She loved the ring! Outstanding shine under light.',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      }
    ]
  },
  {
    _id: '65d1a1b2c3d4e5f678901003',
    name: '24K Pure Swiss Gold Coin 10 Grams (999 Purity)',
    category: 'Coins',
    purity: '24K',
    weightGrams: 10.0,
    makingChargePerGram: 150,
    gstPercentage: 3,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800'
    ],
    description: 'Tamper-proof assay card packaged 24K 999 Fine Gold bullion coin. Ideal for wealth investment and festive gifting.',
    inStock: true,
    stockQuantity: 50,
    hallmarkCertified: true,
    bisCode: 'HM-999-FINE',
    ratings: 4.95,
    numReviews: 64,
    reviews: []
  },
  {
    _id: '65d1a1b2c3d4e5f678901004',
    name: '950 Platinum & Diamond Crown Bangle',
    category: 'Bangles',
    purity: '950 Platinum',
    weightGrams: 28.4,
    makingChargePerGram: 700,
    gstPercentage: 3,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1611591475777-233cd7a77271?w=800'
    ],
    description: 'Rare 950 Platinum bangle studded with micro-pave diamonds. Durable, hypoallergenic, and timelessly modern.',
    inStock: true,
    stockQuantity: 4,
    hallmarkCertified: true,
    bisCode: 'PGI-950-CERT',
    ratings: 4.85,
    numReviews: 14,
    reviews: []
  },
  {
    _id: '65d1a1b2c3d4e5f678901005',
    name: 'Antique Temple Jhumka Earrings 22K Yellow Gold',
    category: 'Earrings',
    purity: '22K',
    weightGrams: 18.2,
    makingChargePerGram: 480,
    gstPercentage: 3,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800'
    ],
    description: 'South Indian Temple architecture inspired 22K Jhumka earrings with ruby stones and hanging pearls.',
    inStock: true,
    stockQuantity: 12,
    hallmarkCertified: true,
    bisCode: 'HM-GOLD-916',
    ratings: 4.78,
    numReviews: 32,
    reviews: []
  },
  {
    _id: '65d1a1b2c3d4e5f678901006',
    name: 'Imperial Chronograph 18K Gold Men’s Luxury Watch',
    category: 'Watches',
    purity: '18K',
    weightGrams: 85.0,
    makingChargePerGram: 850,
    gstPercentage: 3,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'
    ],
    description: 'Automatic swiss movement luxury wristwatch crafted with solid 18K yellow gold case and sapphire crystal glass.',
    inStock: true,
    stockQuantity: 2,
    hallmarkCertified: true,
    bisCode: 'HM-WATCH-750',
    ratings: 5.0,
    numReviews: 8,
    reviews: []
  },
  {
    _id: '65d1a1b2c3d4e5f678901007',
    name: 'Italian Franco Curb 22K Gold Chain 24 Inches',
    category: 'Chains',
    purity: '22K',
    weightGrams: 24.0,
    makingChargePerGram: 380,
    gstPercentage: 3,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800'
    ],
    description: 'Heavy duty 22K Gold Franco chain with lobster claw clasp. High luster polish for daily or occasion wear.',
    inStock: true,
    stockQuantity: 15,
    hallmarkCertified: true,
    bisCode: 'HM-GOLD-916',
    ratings: 4.88,
    numReviews: 21,
    reviews: []
  }
];

export default seedProducts;
