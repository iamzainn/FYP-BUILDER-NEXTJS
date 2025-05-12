import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk using currentUser
    const user = await currentUser();
    console.log("user clerk ", user);
    
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Find the user in the database using clerkId
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id
      }
    });
    
    console.log("dbUser ", dbUser);
    if (!dbUser) {
      return NextResponse.json({ message: "User not found in database" }, { status: 404 });
    }
    
    // Use the database user ID
    const userID = dbUser.id;
    console.log("userID ", userID);
    
    // Parse the request body
    const body = await request.json();
    console.log("body ", body);
    
    // Extract data from request body - handle both name and storeName formats
    const name = body.name || body.storeName;
    console.log("name ", name);
    
    // Extract storeConfig for later saving if needed
    const storeConfig = body.storeConfig;
    console.log("storeConfig ", storeConfig);
    const subdomain = body.subdomain;
    console.log("subdomain ", subdomain);
    
    // Validate input
    if (!name) {
      return NextResponse.json({ message: 'Please provide a store name' }, { status: 400 });
    }
    
    // Check if store name already exists for this user using Prisma
    const existingStore = await prisma.userStore.findFirst({
      where: {
        userId: userID,
        storeName: name
      }
    });
    console.log("existingStore ", existingStore);
    
    if (existingStore) {
      return NextResponse.json({ message: 'You already have a store with this name' }, { status: 400 });
    }
    
    // Generate a unique store ID
    const storeId = uuidv4();
    
    // Create new store with Prisma
    const newStore = await prisma.userStore.create({
      data: {
        userId: userID,
        storeName: name,
        storeId: storeId,
        store_config: storeConfig || undefined,
        subdomain: subdomain
      }
    });
    
    console.log('Successfully created store:', newStore);
    
    // Create default pages if storeConfig exists
    if (storeConfig) {
      // Create Home page with components
      await prisma.page.create({
        data: {
          storeId: newStore.id,
          title: "Home",
          slug: "home",
          pageType: "HOME",
          isPublished: true,
          pageOrder: 1,
          components: {
            create: [
              {
                componentType: "NAVBAR",
                content: {
                  items: storeConfig.navItems || [],
                  styles: storeConfig.navStyles || {}
                },
                order: 1
              },
              {
                componentType: "HERO",
                content: {
                  items: storeConfig.heroItems || [],
                  styles: storeConfig.heroStyles || {}
                },
                order: 2
              },
              {
                componentType: "COLLECTION",
                content: {
                  items: storeConfig.collectionItems || [],
                  styles: storeConfig.collectionStyles || {}
                },
                order: 3
              },
              {
                componentType: "PRODUCT",
                content: {
                  items: storeConfig.productItems || [],
                  styles: storeConfig.productStyles || {}
                },
                order: 4
              },
              {
                componentType: "FOOTER",
                content: {
                  columns: storeConfig.footerColumns || [],
                  socialLinks: storeConfig.footerSocialLinks || [],
                  styles: storeConfig.footerStyles || {}
                },
                order: 5
              }
            ]
          }
        }
      });
      
      // Create Products page with components
      await prisma.page.create({
        data: {
          storeId: newStore.id,
          title: "Products",
          slug: "products",
          pageType: "PRODUCTS",
          isPublished: true,
          pageOrder: 2,
          components: {
            create: [
              {
                componentType: "NAVBAR",
                content: {
                  items: storeConfig.navItems || [],
                  styles: storeConfig.navStyles || {}
                },
                order: 1
              },
              {
                componentType: "PRODUCT",
                content: {
                  items: storeConfig.productItems || [],
                  styles: storeConfig.productStyles || {}
                },
                order: 2
              },
              {
                componentType: "FOOTER",
                content: {
                  columns: storeConfig.footerColumns || [],
                  socialLinks: storeConfig.footerSocialLinks || [],
                  styles: storeConfig.footerStyles || {}
                },
                order: 3
              }
            ]
          }
        }
      });
      
      // Create About page with components
      await prisma.page.create({
        data: {
          storeId: newStore.id,
          title: "About",
          slug: "about",
          pageType: "ABOUT",
          isPublished: true,
          pageOrder: 3,
          components: {
            create: [
              {
                componentType: "NAVBAR",
                content: {
                  items: storeConfig.navItems || [],
                  styles: storeConfig.navStyles || {}
                },
                order: 1
              },
              {
                componentType: "HERO",
                content: {
                  items: [
                    {
                      id: 'about-heading',
                      type: 'heading',
                      content: 'About ' + name,
                      position: 'center',
                      styles: {
                        color: '#ffffff',
                        fontSize: '56px',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        lineHeight: '1.2',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }
                    },
                    {
                      id: 'about-subheading',
                      type: 'subheading',
                      content: 'Learn more about our story',
                      position: 'center',
                      styles: {
                        color: '#ffffff',
                        fontSize: '24px',
                        fontWeight: '400',
                        marginBottom: '2rem',
                        maxWidth: '600px',
                        lineHeight: '1.6',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }
                    }
                  ],
                  styles: storeConfig.heroStyles || {}
                },
                order: 2
              },
              {
                componentType: "FOOTER",
                content: {
                  columns: storeConfig.footerColumns || [],
                  socialLinks: storeConfig.footerSocialLinks || [],
                  styles: storeConfig.footerStyles || {}
                },
                order: 3
              }
            ]
          }
        }
      });
      
      // Create Contact page with components
      await prisma.page.create({
        data: {
          storeId: newStore.id,
          title: "Contact",
          slug: "contact",
          pageType: "CONTACT",
          isPublished: true,
          pageOrder: 4,
          components: {
            create: [
              {
                componentType: "NAVBAR",
                content: {
                  items: storeConfig.navItems || [],
                  styles: storeConfig.navStyles || {}
                },
                order: 1
              },
              {
                componentType: "FOOTER",
                content: {
                  columns: storeConfig.footerColumns || [],
                  socialLinks: storeConfig.footerSocialLinks || [],
                  styles: storeConfig.footerStyles || {}
                },
                order: 2
              }
            ]
          }
        }
      });
    }
    
    return NextResponse.json({
      message: 'Store created successfully',
      store: newStore
    }, { status: 201 });
    
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Create store error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
} 