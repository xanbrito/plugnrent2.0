/**
 * API Route: Scraping do Airbnb
 * POST /api/airbnb/scrape
 * Body: { url: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import type { ApiResponse, AirbnbScrapeResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'URL não fornecida' },
        { status: 400 }
      );
    }

    // Validar URL do Airbnb
    if (!url.includes('airbnb.com') && !url.includes('airbnb.com.br')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'URL inválida. Deve ser um link do Airbnb.' },
        { status: 400 }
      );
    }

    // Fazer requisição para a página do Airbnb com headers apropriados e timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos para scraping

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Erro ao acessar página do Airbnb' },
          { status: response.status }
        );
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extrair o ID da propriedade da URL
      const roomIdMatch = url.match(/rooms\/(\d+)/);
      const roomId = roomIdMatch ? roomIdMatch[1] : null;

      // Inicializar objeto de dados da propriedade
      let propertyData: any = {
      spaceName: '',
      description: '',
      address: '',
      photos: [],
      rules: [],
      amenities: [],
      type: 'espaco-inteiro',
    };

    // Tentar extrair dados do script #data-deferred-state-0
    let airbnbData: any = null;
    
    try {
      const scriptElement = $('#data-deferred-state-0').first();
      if (scriptElement.length > 0) {
        const scriptContent = scriptElement.text();
        if (scriptContent) {
          const parsed = JSON.parse(scriptContent);
          if (parsed.niobeClientData && parsed.niobeClientData[0] && parsed.niobeClientData[0][1]) {
            airbnbData = parsed.niobeClientData[0][1];
          }
        }
      }
    } catch (e) {
      console.error('Erro ao parsear data-deferred-state-0:', e);
    }

    // Se encontrou dados estruturados, extrair informações
    if (airbnbData && airbnbData.data && airbnbData.data.presentation) {
      const presentation = airbnbData.data.presentation;
      
      // Extrair seções do stayProductDetailPage
      if (presentation.stayProductDetailPage && presentation.stayProductDetailPage.sections) {
        const sections = presentation.stayProductDetailPage.sections.sections || [];
        
        sections.forEach((section: any) => {
          const sectionId = section.sectionId;
          const sectionData = section.section;

          // DESCRIÇÃO COMPLETA (DESCRIPTION_DEFAULT)
          if (sectionId === 'DESCRIPTION_DEFAULT' && sectionData.htmlDescription) {
            const htmlText = sectionData.htmlDescription.htmlText || '';
            if (htmlText) {
              const descHtml = cheerio.load(htmlText);
              propertyData.description = descHtml.text().trim() || descHtml('body').html() || htmlText;
            }
          }

          // AMENIDADES (AMENITIES_DEFAULT)
          if (sectionId === 'AMENITIES_DEFAULT') {
            const amenitiesList: string[] = [];
            
            if (sectionData.seeAllAmenitiesGroups && Array.isArray(sectionData.seeAllAmenitiesGroups)) {
              sectionData.seeAllAmenitiesGroups.forEach((group: any) => {
                if (group.amenities && Array.isArray(group.amenities)) {
                  group.amenities.forEach((amenity: any) => {
                    const title = amenity.title || amenity.name || amenity;
                    if (title && typeof title === 'string') {
                      amenitiesList.push(title);
                    }
                  });
                }
              });
            }
            
            if (sectionData.amenities && Array.isArray(sectionData.amenities)) {
              sectionData.amenities.forEach((amenity: any) => {
                const title = amenity.title || amenity.name || amenity;
                if (title && typeof title === 'string' && !amenitiesList.includes(title)) {
                  amenitiesList.push(title);
                }
              });
            }
            
            if (amenitiesList.length > 0) {
              propertyData.amenities = amenitiesList;
            }
          }

          // REGRAS (POLICIES_DEFAULT)
          if (sectionId === 'POLICIES_DEFAULT' && sectionData.houseRulesSections) {
            const rulesList: string[] = [];
            const rulesSections = sectionData.houseRulesSections || [];
            
            rulesSections.forEach((ruleSection: any) => {
              if (ruleSection.items && Array.isArray(ruleSection.items)) {
                ruleSection.items.forEach((item: any) => {
                  if (item.title) {
                    rulesList.push(item.title);
                  }
                });
              }
            });
            
            propertyData.rules = rulesList;
          }

          // LOCALIZAÇÃO (LOCATION_DEFAULT)
          if (sectionId === 'LOCATION_DEFAULT' && sectionData.subtitle) {
            propertyData.address = sectionData.subtitle || '';
            if (sectionData.title) {
              propertyData.address = `${sectionData.title}, ${propertyData.address}`;
            }
          }
        });
      }

      // Extrair nome da propriedade
      if (presentation.stayProductDetailPage && presentation.stayProductDetailPage.sections) {
        const listingInfo = presentation.stayProductDetailPage;
        if (listingInfo.title) {
          propertyData.spaceName = listingInfo.title;
        }
      }

      // Extrair fotos - buscar em diferentes locais
      const photosSet = new Set<string>();
      
      if (airbnbData.data && airbnbData.data.presentation) {
        const presentation = airbnbData.data.presentation;
        
        // 1. Tentar encontrar fotos no contexto de mídia
        const mediaContext = presentation.stayProductDetailPage?.media?.media;
        if (mediaContext && Array.isArray(mediaContext)) {
          mediaContext.forEach((media: any) => {
            if (media.photo) {
              const photoUrl = media.photo.picture || media.photo.large || media.photo.medium || media.photo.thumbnail || '';
              if (photoUrl && typeof photoUrl === 'string') {
                photosSet.add(photoUrl);
              }
            }
          });
        }

        // 2. Tentar encontrar fotos nas seções
        const photosSection = presentation.stayProductDetailPage?.sections?.sections?.find(
          (s: any) => s.sectionId === 'PHOTOS_DEFAULT' || s.section?.photos || s.section?.pictureUrls
        );
        if (photosSection && photosSection.section) {
          if (photosSection.section.photos && Array.isArray(photosSection.section.photos)) {
            photosSection.section.photos.forEach((photo: any) => {
              const url = photo.picture || photo.url || photo.large || photo.medium || photo;
              if (url && typeof url === 'string') {
                photosSet.add(url);
              }
            });
          }
          if (photosSection.section.pictureUrls && Array.isArray(photosSection.section.pictureUrls)) {
            photosSection.section.pictureUrls.forEach((url: any) => {
              if (url && typeof url === 'string') {
                photosSet.add(url);
              }
            });
          }
        }

        // 3. Buscar fotos recursivamente no objeto
        const findPhotosInObject = (obj: any, depth = 0): void => {
          if (depth > 10) return;
          
          if (typeof obj === 'string' && (obj.includes('a0.muscache.com') || obj.includes('muscache'))) {
            photosSet.add(obj);
            return;
          }
          
          if (Array.isArray(obj)) {
            obj.forEach(item => findPhotosInObject(item, depth + 1));
          } else if (typeof obj === 'object' && obj !== null) {
            if (obj.picture || obj.url || obj.image || obj.photo) {
              const photoUrl = obj.picture || obj.url || obj.image || obj.photo;
              if (photoUrl && typeof photoUrl === 'string' && (photoUrl.includes('muscache') || photoUrl.includes('airbnb'))) {
                photosSet.add(photoUrl);
              }
            }
            
            Object.values(obj).forEach(value => findPhotosInObject(value, depth + 1));
          }
        };
        
        findPhotosInObject(presentation);
      }

      if (photosSet.size > 0) {
        propertyData.photos = Array.from(photosSet);
      }

      // Extrair tipo de propriedade
      const roomType = airbnbData.data?.presentation?.stayProductDetailPage?.roomTypeCategory;
      if (roomType) {
        propertyData.type = roomType === 'PRIVATE_ROOM' || roomType === 'private_room' ? 'quarto' : 'espaco-inteiro';
      }

      // Buscar nome da propriedade em metadata
      const metadata = presentation.stayProductDetailPage?.sections?.metadata;
      if (metadata?.loggingEventData?.listing) {
        const listing = metadata.loggingEventData.listing;
        if (listing.name || listing.publicTitle) {
          propertyData.spaceName = listing.name || listing.publicTitle || propertyData.spaceName;
        }
      }
    }

    // Fallback: Extrair fotos do HTML se não encontrou nos dados estruturados ou complementar
    const photoUrls = new Set<string>(propertyData.photos);
    
    // Buscar todas as imagens que parecem ser do Airbnb
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src') || '';
      if (src && (src.includes('a0.muscache.com') || src.includes('muscache') || src.includes('airbnb') || src.includes('cdn.airbnb'))) {
        let cleanUrl = src.split('?')[0];
        if (cleanUrl && cleanUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
          photoUrls.add(cleanUrl);
        }
      }
    });

    // Buscar URLs de imagem em atributos data-*
    $('[data-url], [data-src], [data-image], [data-lazy-src], [data-original]').each((_, el) => {
      const url = $(el).attr('data-url') || $(el).attr('data-src') || $(el).attr('data-image') || 
                 $(el).attr('data-lazy-src') || $(el).attr('data-original') || '';
      if (url && (url.includes('a0.muscache.com') || url.includes('muscache') || url.includes('cdn.airbnb'))) {
        let cleanUrl = url.split('?')[0];
        if (cleanUrl && cleanUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
          photoUrls.add(cleanUrl);
        }
      }
    });

    // Buscar URLs de imagem em scripts JSON
    $('script').each((_, el) => {
      const scriptContent = $(el).html() || '';
      const imagePatterns = [
        /https?:\/\/[^"'\s]*(?:a0\.muscache\.com|muscache|cdn\.airbnb)[^"'\s]*\.(?:jpg|jpeg|png|webp)/gi,
        /"picture":\s*"([^"]+)"/gi,
        /"url":\s*"([^"]*(?:muscache|airbnb)[^"]*\.(?:jpg|jpeg|png|webp))"/gi,
        /"image":\s*"([^"]*(?:muscache|airbnb)[^"]*\.(?:jpg|jpeg|png|webp))"/gi,
      ];
      
      imagePatterns.forEach(pattern => {
        const matches = scriptContent.matchAll(pattern);
        for (const match of matches) {
          const url = match[1] || match[0];
          if (url && typeof url === 'string') {
            let cleanUrl = url.split('?')[0];
            if (cleanUrl && cleanUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
              photoUrls.add(cleanUrl);
            }
          }
        }
      });
    });

    // Buscar em elementos com background-image
    $('[style*="background-image"]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const bgMatch = style.match(/url\(['"]?([^'")]+)['"]?\)/);
      if (bgMatch && bgMatch[1] && (bgMatch[1].includes('muscache') || bgMatch[1].includes('airbnb'))) {
        let cleanUrl = bgMatch[1].split('?')[0];
        if (cleanUrl && cleanUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
          photoUrls.add(cleanUrl);
        }
      }
    });

    // Converter Set para Array e limitar
    propertyData.photos = Array.from(photoUrls).slice(0, 50);

    // Fallback: Extrair nome da propriedade do título
    if (!propertyData.spaceName) {
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch) {
        propertyData.spaceName = titleMatch[1]
          .replace(/\s*-\s*Airbnb\s*/i, '')
          .trim();
      }
    }

    // Fallback: Extrair descrição do meta description se não encontrou
    if (!propertyData.description) {
      const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      if (metaDescMatch) {
        propertyData.description = metaDescMatch[1];
      }
    }

    // Fallback: Extrair endereço se não encontrou
    if (!propertyData.address) {
      const addressMatches = [
        html.match(/"address":"([^"]+)"/),
        html.match(/"location":"([^"]+)"/),
        html.match(/data-location="([^"]+)"/),
        html.match(/<span[^>]*class="[^"]*address[^"]*"[^>]*>([^<]+)<\/span>/i),
      ];
      
      for (const match of addressMatches) {
        if (match && match[1]) {
          propertyData.address = match[1];
          break;
        }
      }
    }

    // Limpar e validar dados
    if (propertyData.description) {
      propertyData.description = propertyData.description
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Limpar URLs de fotos (remover parâmetros desnecessários)
    propertyData.photos = propertyData.photos.map((photo: string) => {
      let cleanPhoto = photo.split('?')[0];
      if (!cleanPhoto.match(/\.(jpg|jpeg|png|webp)$/i)) {
        cleanPhoto = cleanPhoto.replace(/\/$/, '') + '.jpg';
      }
      return cleanPhoto;
    }).filter((photo: string) => photo && photo.startsWith('http'));

    // Determinar tipo (quarto ou espaço inteiro) - fallback
    if (!propertyData.type) {
      const typeText = $('[data-section-id="ROOM_TYPE"]').text().toLowerCase() || '';
      propertyData.type = typeText.includes('quarto') ? 'quarto' : 'espaco-inteiro';
    }

    const spaceName = propertyData.spaceName || 'Nome não encontrado';
    const description = propertyData.description || '';
    const photos = propertyData.photos || [];
    const rules = propertyData.rules || [];
    const amenities = propertyData.amenities || [];
    const type = propertyData.type || 'espaco-inteiro';

      return NextResponse.json<ApiResponse<AirbnbScrapeResponse['data']>>({
        success: true,
        data: {
          spaceName,
          description,
          photos: photos.slice(0, 20), // Limitar a 20 fotos
          rules,
          amenities,
          type,
        },
        airbnbLink: url,
      } as AirbnbScrapeResponse);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Timeout: A requisição ao Airbnb demorou muito para responder' },
          { status: 504 }
        );
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('Erro ao fazer scraping do Airbnb:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

