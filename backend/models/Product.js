import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    userAvatar: { type: String }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Necklaces', 'Rings', 'Earrings', 'Watches', 'Chains', 'Coins', 'Bangles']
    },
    purity: {
      type: String,
      required: true,
      enum: ['24K', '22K', '18K', '14K', '950 Platinum']
    },
    weightGrams: { type: Number, required: true },
    makingChargePerGram: { type: Number, required: true, default: 450 },
    gstPercentage: { type: Number, default: 3 },
    featured: { type: Boolean, default: false },
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 10 },
    hallmarkCertified: { type: Boolean, default: true },
    bisCode: { type: String, default: 'HM-GOLD-916' },
    ratings: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 12 },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

// Virtual property to calculate estimated base metal price (using 24K baseline of ₹7200/g)
productSchema.methods.calculateCurrentPrice = function (liveGold24KRate = 7200) {
  let multiplier = 1.0;
  if (this.purity === '22K') multiplier = 0.916;
  if (this.purity === '18K') multiplier = 0.750;
  if (this.purity === '14K') multiplier = 0.585;
  if (this.purity === '950 Platinum') multiplier = 0.65;

  const rawMetalCost = this.weightGrams * (liveGold24KRate * multiplier);
  const totalMaking = this.weightGrams * this.makingChargePerGram;
  const subtotal = rawMetalCost + totalMaking;
  const gst = subtotal * (this.gstPercentage / 100);
  
  return {
    rawMetalCost: Math.round(rawMetalCost),
    makingCharges: Math.round(totalMaking),
    subtotal: Math.round(subtotal),
    gst: Math.round(gst),
    totalPrice: Math.round(subtotal + gst)
  };
};

const Product = mongoose.model('Product', productSchema);
export default Product;
