-- Inserta productos solo si la tabla existe y está vacía
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'Product'
  ) THEN
    IF (SELECT COUNT(*) FROM "Product") = 0 THEN
      INSERT INTO "Product" (id, name, description, price, stock, deleted, "imageUrl", "updatedAt") VALUES
        (gen_random_uuid(), 'Laptop Lenovo ThinkPad', 'Laptop empresarial con procesador Intel i7', 8000000.00, 200, false, 'https://p3-ofp.static.pub//fes/cms/2024/04/01/osqn4brfn79vgwdhq64mis2ddur9a6681695.png', NOW()),
        (gen_random_uuid(), 'Mouse Logitech MX Master', 'Mouse inalámbrico ergonómico', 300000.00, 100, false, 'https://expocolsuministros.com/wp-content/uploads/2020/06/Negro1.png', NOW()),
        (gen_random_uuid(), 'Monitor Dell 27"', 'Monitor Full HD de 27 pulgadas', 1200000.00, 20, false, 'https://dellstatic.luroconnect.com/media/catalog/product/cache/74ae05ef3745aec30d7f5a287debd7f5/m/o/monitor-dell-plus-s2725dc-gy-gallery-1.png', NOW()),
        (gen_random_uuid(), 'Auriculares Sony WH-1000XM4', 'Cancelación de ruido', 350000.00, 15, false, 'https://edifier-online.com/cdn/shop/files/WH700NB-black_H1-sSGdC3.png?v=1709905172&width=1500', NOW()),
        (gen_random_uuid(), 'Teclado Keychron K2', 'Switches Gateron', 120000.00, 25, false, 'https://www.keychron.com/cdn/shop/files/V4M_daf2dbc7-9637-451b-97ab-30ff0a9e0b6e.png?v=11150360547031123723', NOW()),
        (gen_random_uuid(), 'Samsung Galaxy S23', 'Pantalla AMOLED', 4500000.00, 30, false, 'https://static.vecteezy.com/system/resources/previews/022/722/945/non_2x/samsung-galaxy-s23-ultra-transparent-image-free-png.png', NOW()),
        (gen_random_uuid(), 'Camiseta Nike Dri-FIT', 'Transpirable', 90000.00, 100, false, 'https://midwaysports.com/cdn/shop/files/NikeWomenDri-FitPark20TopSSDRA_2.png?v=1732960612', NOW()),
        (gen_random_uuid(), 'Zapatos Adidas Ultraboost', 'Amortiguación avanzada', 180000.00, 40, false, 'https://www.sportline.com.co/media/catalog/product/h/q/hq6353-1-footwear-photography-side_lateral_center_view-transparent.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:&format=jpeg', NOW()),
        (gen_random_uuid(), 'Café Juan Valdez 500g', 'Café premium colombiano', 15000.00, 200, false, 'https://juanvaldez.com/wp-content/uploads/2022/06/6016243545ef1c053a4a8b17_cafe-colina-balanceado-juan-valdez-1.png', NOW()),
        (gen_random_uuid(), 'Silla Gamer Razer Iskur', 'Ergonómica', 450000.00, 12, false, 'https://www.newstoregye.com/cdn/shop/files/NomadaWare_silla_razer_iskur_v2_x_fabric_black.webp?v=1760478580', NOW());
      RAISE NOTICE '✅ Productos insertados';
    ELSE
      RAISE NOTICE 'ℹ️ Tabla Product ya tiene datos, no se insertan productos';
    END IF;
  ELSE
    RAISE NOTICE '⚠️ Tabla Product no existe—verifica migraciones';
  END IF;
END
$$;
